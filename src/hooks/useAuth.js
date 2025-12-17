import { useAtom } from 'jotai'
import { userAtom, isAuthenticatedAtom, authLoadingAtom, authErrorAtom } from '../store/atoms'
import { useAuthActions } from '../store/actions/authActions'
import { userDisplayNameAtom } from '../store/selectors/authSelectors'

/**
 * Custom hook for authentication state and actions
 * Provides centralized access to all auth-related functionality
 * Uses Jotai for global state management
 * NO token management - HTTP-Only cookies handled by browser
 */
const useAuth = () => {
    const [user] = useAtom(userAtom)
    const [isAuthenticated] = useAtom(isAuthenticatedAtom)
    const [isLoading] = useAtom(authLoadingAtom)
    const [error] = useAtom(authErrorAtom)
    const [displayName] = useAtom(userDisplayNameAtom)

    const { login, signup, verifyOtp, googleLogin, logout, getCurrentUser, clearError } = useAuthActions()

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        error,
        displayName,

        // Actions
        login,
        signup,
        verifyOtp,
        googleLogin,
        logout,
        getCurrentUser,
        clearError
    }
}

export default useAuth
