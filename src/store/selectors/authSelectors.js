import { atom } from 'jotai'
import { userAtom, isAuthenticatedAtom } from '../atoms'

/**
 * Selector for getting user display name
 */
export const userDisplayNameAtom = atom((get) => {
    const user = get(userAtom)
    return user?.name || 'User'
})

/**
 * Selector for getting user email
 */
export const userEmailAtom = atom((get) => {
    const user = get(userAtom)
    return user?.email || ''
})

/**
 * Selector for checking if email is verified
 */
export const isEmailVerifiedAtom = atom((get) => {
    const user = get(userAtom)
    return user?.isVerified || false
})

/**
 * Selector for checking user role
 */
export const userRoleAtom = atom((get) => {
    const user = get(userAtom)
    return user?.role || 'user'
})

/**
 * Selector combining authentication state
 * NO token field - tokens are in HTTP-Only cookies, handled by browser
 */
export const authStateAtom = atom((get) => ({
    isAuthenticated: get(isAuthenticatedAtom),
    user: get(userAtom),
    displayName: get(userDisplayNameAtom),
    email: get(userEmailAtom),
    role: get(userRoleAtom),
    isVerified: get(isEmailVerifiedAtom)
}))
