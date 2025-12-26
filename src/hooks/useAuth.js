import { useAtom } from 'jotai'
import { userAtom, isAuthenticatedAtom, authLoadingAtom, authErrorAtom } from '../store/atoms'
import { useAuthActions } from '../store/actions/authActions'
import { userDisplayNameAtom } from '../store/selectors/authSelectors'


const useAuth = () => {
    const [user] = useAtom(userAtom)
    const [isAuthenticated] = useAtom(isAuthenticatedAtom)
    const [isLoading] = useAtom(authLoadingAtom)
    const [error] = useAtom(authErrorAtom)
    const [displayName] = useAtom(userDisplayNameAtom)

    const { login, signup, verifyOtp, googleLogin, logout, getCurrentUser, clearError } = useAuthActions()

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        displayName,

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
