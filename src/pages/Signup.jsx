import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { message, Spin } from 'antd'
import Header from '../components/layout/Header'
import { authAPI } from '../services/api'
import { GoogleAuthButton } from '../components/common/auth/GoogleAuthButton'
import { AppleAuthButton } from '../components/common/auth/AppleAuthButton'

const Signup = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

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
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            // Send signup request with credentials: 'include'
            // Backend will return user data (not verified yet, no token)
            const response = await authAPI.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })

            if (response.data) {
                const userId = response.data._id || response.data.data?._id
                message.success('Account created! Please verify your email with OTP.')
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        userId: userId,
                        isFromLogin: false
                    }
                })
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Signup failed. Please try again.'

            if (errorMsg.includes('verified') || errorMsg.includes('User already exists and is verified')) {
                message.info('This email is already registered. Redirecting to login...')
                setTimeout(() => {
                    navigate('/login')
                }, 1500)
            }
            else if (err.response?.status === 400 && err.response?.data?.data?._id) {
                const userId = err.response.data.data._id
                message.info('User exists. Please verify your email with OTP.')
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        userId: userId,
                        isFromLogin: false
                    }
                })
            } else {
                message.error(errorMsg)
                console.error('Signup error:', err)
            }
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
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create account</h2>
                        <p className="text-center text-gray-600 mb-6">Join us today</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your  name"
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

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
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="At least 8 characters"
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spin size="small" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Sign up'
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
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 font-medium hover:text-blue-800"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <p className="text-center text-gray-600 text-sm mb-6">or use one of these options</p>
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

export default Signup
