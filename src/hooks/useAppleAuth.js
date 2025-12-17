import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { message } from 'antd'
import { userAtom } from '../store/atoms'
import { authAPI } from '../services/api'

export const useAppleAuth = () => {
    const navigate = useNavigate()
    const [, setUser] = useAtom(userAtom)

    const handleAppleSuccess = useCallback(async (response) => {
        try {
            if (!response.authorization?.id_token) {
                message.error('Failed to get Apple token')
                return
            }

            const token = response.authorization.id_token
            const user = response.user

            // Extract user info from Apple response
            const appleId = response.user?.uid || 'apple_' + Date.now()
            const email = user?.email || response.authorization.email
            const fullName = user?.name

            // Send token to backend for verification and user creation/login
            // Backend will set tokens in HTTP-Only cookies
            const backendResponse = await authAPI.appleLogin({
                tokenId: token,
                appleId: appleId,
                email: email,
                name: fullName?.firstName ? `${fullName.firstName} ${fullName.lastName || ''}`.trim() : email.split('@')[0],
            })

            if (backendResponse.data?.user) {
                // User is authenticated, token is in HTTP-Only cookie
                // Store user data in Jotai atom for UI
                setUser(backendResponse.data.user)

                message.success('Apple login successful!')
                navigate('/')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Apple login failed'

            if (err.response?.status === 400 || err.response?.status === 403) {
                // User exists but not verified, need OTP
                const userId = err.response?.data?._id || err.response?.data?.user?._id
                const email = err.response?.data?.email || err.response?.data?.user?.email

                if (userId && email) {
                    message.info('Please verify your email with OTP')
                    navigate('/verify-otp', {
                        state: {
                            email: email,
                            userId: userId,
                            isFromLogin: true,
                        },
                    })
                    return
                }
            }

            message.error(errorMsg)
            console.error('Apple auth error:', err)
        }
    }, [navigate, setUser])

    const handleAppleError = useCallback((error) => {
        console.error('Apple authentication error:', error)
        message.error('Apple login failed. Please try again.')
    }, [])

    return { handleAppleSuccess, handleAppleError }
}
