import axios from 'axios'

const API = import.meta.env.VITE_API_URL

/**
 * API Client Configuration
 * - withCredentials: true = credentials: 'include' in fetch
 * - This tells the browser to automatically send HTTP-Only cookies
 * - Backend sets tokens in HTTP-Only cookies, browser sends them automatically
 */
const apiClient = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Auth Check Client - NO interceptors
 * Used only for checking if user is logged in
 * Should NOT redirect or refresh on 401
 */
const authCheckClient = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Response interceptor - handles 401 errors with auto-refresh
 * When access token expires (401 response):
 * 1. Try to refresh the token
 * 2. If successful, retry the original request
 * 3. If refresh fails, let the error propagate
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Check for 401 (unauthorized) and ensure we don't retry multiple times
        // Also prevent infinite loop by not retrying the refresh endpoint itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/auth/refresh')
        ) {
            originalRequest._retry = true

            try {
                // Try to refresh the access token
                // Backend will set new accessToken in HTTP-Only cookie
                const refreshResponse = await apiClient.post('/api/auth/refresh')

                if (refreshResponse.status === 200) {
                    // Token was refreshed, retry the original request
                    // New accessToken is already in the HTTP-Only cookie
                    return apiClient.request(originalRequest)
                }
            } catch (refreshError) {
                // Refresh failed, just return error
                console.error('Token refresh failed:', refreshError)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export const countryAPI = {
    getCountries: () => apiClient.get('/api/country/all'),
}

export const authAPI = {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    signup: (userData) => apiClient.post('/api/auth/register', userData),
    verifyOtp: (data) => apiClient.post('/api/auth/verify', data),
    resendOtp: (data) => apiClient.post('/api/auth/resend-otp', data),
    googleLogin: (data) => apiClient.post('/api/auth/google', data),
    appleLogin: (data) => apiClient.post('/api/auth/apple-login', data),
    // Use authCheckClient (no interceptors) to check if user exists
    getCurrentUser: () => authCheckClient.get('/api/auth/me'),
    logout: () => apiClient.post('/api/auth/logout'),
}

export const hotelAPI = {
    searchHotels: (data) => apiClient.post('/api/hotel/search', data),
    Hotel: (data) => apiClient.post('/api/hotel/search/hp', data),
}

export default apiClient