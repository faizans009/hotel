import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { message } from 'antd'
import { userAtom } from '../store/atoms'
import { authAPI } from '../services/api'

export const useGoogleAuth = () => {
    const navigate = useNavigate()
    const [, setUser] = useAtom(userAtom)

    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                message.error('Failed to get Google token')
                return
            }

            // Extract user info from Google JWT token
            const token = credentialResponse.credential
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            )
            const userData = JSON.parse(jsonPayload)

            // Send token to backend for verification and user creation/login
            // Backend will set tokens in HTTP-Only cookies
            const response = await authAPI.googleLogin({
                name: userData.name,
                email: userData.email,
                googleId: userData.sub,
                picture: userData.picture,
                tokenId: token
            })

            if (response.data?.user) {
                // User is authenticated, token is in HTTP-Only cookie
                // Store user data in Jotai atom for UI
                setUser(response.data.user)

                message.success('Google login successful!')
                navigate('/')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Google login failed'

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
            console.error('Google auth error:', err)
        }
    }, [navigate, setUser])

    const handleGoogleError = useCallback(() => {
        message.error('Google login failed. Please try again.')
        console.error('Google login failed')
    }, [])

    return { handleGoogleSuccess, handleGoogleError }
}
