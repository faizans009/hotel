import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { message, Spin } from 'antd'
import Header from '../components/layout/Header'
import { authAPI } from '../services/api'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { GoogleAuthButton } from '../components/common/auth/GoogleAuthButton'
import { AppleAuthButton } from '../components/common/auth/AppleAuthButton'

const Login = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const googleButtonRef = useRef(null)
    const { handleGoogleSuccess } = useGoogleAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    useEffect(() => {
        if (window.google && googleButtonRef.current && !googleButtonRef.current.hasRendered) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleSuccess,
            })

            window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: 'outline',
                size: 'large',
                width: '100%',
            })
            googleButtonRef.current.hasRendered = true
        }
    }, [handleGoogleSuccess])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            // Send login request with credentials: 'include'
            // Backend will set accessToken in HTTP-Only cookie
            const response = await authAPI.login(formData)

            if (response.data?.user) {
                // User is authenticated, token is in HTTP-Only cookie
                message.success('Login successful!')
                navigate('/')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed. Please try again.'

            if (err.response?.status === 403 || errorMsg.includes('verify') || errorMsg.includes('OTP')) {
                // Email not verified, need OTP
                const userId = err.response?.data?._id || err.response?.data?.data?._id
                message.info('Please verify your email with OTP')
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        userId: userId,
                        isFromLogin: true
                    }
                })
            } else {
                message.error(errorMsg)
            }
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Sign in</h2>
                        <p className="text-center text-gray-600 mb-6">to your account</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spin size="small" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        <p className="text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-blue-600 font-medium hover:text-blue-800"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <p className="text-center text-gray-600 text-sm mb-4">or use one of these options</p>
                        <div className="flex items-center justify-center gap-4">
                            <GoogleAuthButton />
                            <AppleAuthButton />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
