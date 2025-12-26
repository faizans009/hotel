import axios from 'axios'

const API = import.meta.env.VITE_API_URL


const apiClient = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

const authCheckClient = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/auth/refresh')
        ) {
            originalRequest._retry = true

            try {
                const refreshResponse = await apiClient.post('/api/auth/refresh')

                if (refreshResponse.status === 200) {
                    return apiClient.request(originalRequest)
                }
            } catch (refreshError) {
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
    googleLogin: (data) => apiClient.post('/api/auth/google-login', data),
    appleLogin: (data) => apiClient.post('/api/auth/apple-login', data),
    getCurrentUser: () => authCheckClient.get('/api/auth/me'),
    logout: () => apiClient.post('/api/auth/logout'),
}

export const hotelAPI = {
    searchHotels: (data) => apiClient.post('/api/hotel/search', data),
    Hotel: (data) => apiClient.post('/api/hotel/search/hp', data),
    PreBooking: (data) => apiClient.post('/api/hotel/prebook', data),
    BookingForm: (data) => apiClient.post('/api/hotel/booking/form', data),
    CompleteBooking: (data) => apiClient.post('/api/hotel/booking/finish', data),
}

export const paymentAPI = {
    createPaymentIntent: (data) => apiClient.post('/api/payment/payment-intent', data),
    confirmPayment: (intentId) => apiClient.get(`/api/payment/payment/${intentId}`),
    checkPaymentStatus: (intentId) => apiClient.get(`/api/payment/payment-status/${intentId}`),
    refundPayment: (intentId, amount) => apiClient.post(`/api/payment/refund/${intentId}`, { amount }),
}

export default apiClient