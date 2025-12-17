import { useEffect } from 'react'
import { useAppleAuth } from '../../../hooks/useAppleAuth'

export const AppleAuthButton = () => {
    const { handleAppleSuccess } = useAppleAuth()
    useEffect(() => {
        if (window.AppleID) {
            window.AppleID.auth.init({
                clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
                teamId: import.meta.env.VITE_APPLE_TEAM_ID,
                keyId: import.meta.env.VITE_APPLE_KEY_ID,
                redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI,
                usePopup: true,
                onSuccess: handleAppleSuccess,
            })
        }
    }, [handleAppleSuccess])

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault()
                if (window.AppleID) {
                    window.AppleID.auth.signIn()
                }
            }}
            className="flex items-center justify-center border-2 border-gray-300 rounded hover:bg-gray-50 transition bg-white"
            style={{ width: '52px', height: '52px' }}
            title="Sign in with Apple"
        >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.08 2.29.74 3.08.8 1.18-.24 2.17-.96 3.48-1.04 1.51-.08 2.84.87 3.1 2.17-2.89 1.65-2.39 5.43.6 6.45-.53 1.5-1.69 2.59-3.06 3.27l-.07-.04z" />
            </svg>
        </button>
    )
}
