import { useAtom } from 'jotai'
import { userAtom, authLoadingAtom, authErrorAtom } from '../atoms'
import { authAPI } from '../../services/api'

/**
 * Custom hook for authentication actions
 * Provides login, signup, logout, and error handling
 * NO token management - tokens are in HTTP-Only cookies, handled by browser
 */
export const useAuthActions = () => {
    const [, setUser] = useAtom(userAtom)
    const [, setLoading] = useAtom(authLoadingAtom)
    const [, setError] = useAtom(authErrorAtom)

    const login = async (credentials) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authAPI.login(credentials)
            // Backend returns user data (token is in HTTP-Only cookie)
            setUser(response.data.user)
            return { success: true, data: response.data.user }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed'
            setError(errorMsg)
            return { success: false, error: errorMsg }
        } finally {
            setLoading(false)
        }
    }

    const signup = async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authAPI.signup(userData)
            // Backend returns user data (not yet verified, no token yet)
            return { success: true, data: response.data.data || response.data }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Signup failed'
            setError(errorMsg)
            return { success: false, error: errorMsg }
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async (data) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authAPI.verifyOtp(data)
            // Backend returns verified user and sets token in HTTP-Only cookie
            setUser(response.data.user)
            return { success: true, data: response.data.user }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'OTP verification failed'
            setError(errorMsg)
            return { success: false, error: errorMsg }
        } finally {
            setLoading(false)
        }
    }

    const googleLogin = async (data) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authAPI.googleLogin(data)
            // Backend returns user data (token is in HTTP-Only cookie)
            setUser(response.data.user)
            return { success: true, data: response.data.user }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Google login failed'
            setError(errorMsg)
            return { success: false, error: errorMsg }
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        try {
            // Send logout request - backend clears HTTP-Only cookies
            await authAPI.logout()
            // Clear user from state
            setUser(null)
        } catch (err) {
            console.error('Logout error:', err)
            // Even if logout fails, clear the user locally
            setUser(null)
        } finally {
            setError(null)
            setLoading(false)
        }
    }

    const getCurrentUser = async () => {
        try {
            const response = await authAPI.getCurrentUser()
            // Restore user from backend
            setUser(response.data.user)
            return { success: true, data: response.data.user }
        } catch (err) {
            // User not authenticated
            setUser(null)
            return { success: false, error: err.response?.data?.message }
        }
    }

    const clearError = () => {
        setError(null)
    }

    return {
        login,
        signup,
        verifyOtp,
        googleLogin,
        logout,
        getCurrentUser,
        clearError
    }
}

/**
 * Hook to update user profile
 */
export const useUpdateUser = () => {
    const [, setUser] = useAtom(userAtom)

    const updateUser = (userData) => {
        setUser(prev => ({
            ...prev,
            ...userData
        }))
    }

    return updateUser
}
