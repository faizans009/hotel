import { atom } from 'jotai'

/**
 * User atom - stores the current authenticated user
 * HTTP-Only cookies are handled by the browser automatically
 * We only store user data in state/storage for UI purposes
 * Using regular atom (not atomWithStorage) to avoid localStorage conflicts on logout
 */
export const userAtom = atom(null)

/**
 * Loading atom - tracks authentication loading state
 */
export const authLoadingAtom = atom(false)

/**
 * Error atom - tracks authentication errors
 */
export const authErrorAtom = atom(null)

/**
 * Derived atom - checks if user is authenticated
 * No need to check token - if user exists, they have a valid token in HTTP-Only cookie
 */
export const isAuthenticatedAtom = atom((get) => {
    const user = get(userAtom)
    return !!user
})

/**
 * Derived atom - checks initialization status
 */
export const authInitializedAtom = atom(true)
