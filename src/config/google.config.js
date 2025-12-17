export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

export const googleConfig = {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/callback`,
}
