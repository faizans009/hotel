import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { message, Spin } from 'antd'
import Header from '../components/layout/Header'
import { authAPI } from '../services/api'
import { userAtom } from '../store/atoms'

const OtpVerification = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [, setUser] = useAtom(userAtom)

    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendLoading, setResendLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const otpRefs = useRef([])

    const email = location.state?.email
    const userId = location.state?.userId
    const isFromLogin = location.state?.isFromLogin || false

    useEffect(() => {
        if (!email || !userId) {
            navigate('/signup')
        }
    }, [email, userId, navigate])

    useEffect(() => {
        let interval
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [resendTimer])

    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return

        const newOtpDigits = [...otpDigits]
        newOtpDigits[index] = value
        setOtpDigits(newOtpDigits)
        setError('')

        // Move to next input if value is entered
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        const otp = otpDigits.join('')

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Send OTP verification with credentials: 'include'
            // Backend will set accessToken and refreshToken in HTTP-Only cookies
            const response = await authAPI.verifyOtp({
                userId,
                email,
                otp
            })

            if (response.data?.user) {
                // User is now verified
                // Tokens are in HTTP-Only cookies (automatically handled by browser)
                // Store user data in Jotai atom for UI
                setUser(response.data.user)

                message.success('Email verified successfully!')

                // Navigate to home
                navigate('/')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'OTP verification failed'

            if (errorMsg.includes('expired') || errorMsg.includes('OTP')) {
                setError('OTP expired. Please request a new one.')
            } else {
                setError(errorMsg)
            }
            console.error('OTP verification error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setResendLoading(true)
        setError('')

        try {
            const response = await authAPI.resendOtp({
                userId,
                email
            })

            if (response.data?.success) {
                message.success('OTP sent to your email')
                setOtpDigits(['', '', '', '', '', ''])
                setResendTimer(60)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to resend OTP'
            setError(errorMsg)
            message.error(errorMsg)
            console.error('Resend OTP error:', err)
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Verify your email</h2>
                        <p className="text-center text-gray-600 mb-2">Enter the OTP sent to</p>
                        <p className="text-center text-gray-900 font-medium mb-8">{email}</p>

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            {/* OTP Input Boxes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Enter OTP</label>
                                <div className="flex gap-2 justify-center">
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            maxLength="1"
                                            disabled={isLoading}
                                            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${error ? 'border-red-500' : 'border-gray-300'
                                                } ${digit ? 'border-blue-500' : ''}`}
                                        />
                                    ))}
                                </div>
                                {error && (
                                    <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                                )}
                            </div>

                            {/* Verify Button */}
                            <button
                                type="submit"
                                disabled={isLoading || otpDigits.some(d => !d)}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <Spin size="small" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </form>

                        {/* Resend Section */}
                        <div className="mt-8">
                            {resendTimer > 0 ? (
                                <p className="text-center text-gray-600 text-sm">
                                    Resend OTP in <span className="font-semibold text-blue-600">{resendTimer}s</span>
                                </p>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={resendLoading}
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend OTP'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => isFromLogin ? navigate('/login') : navigate('/signup')}
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                            >
                                ← Back to {isFromLogin ? 'Login' : 'Signup'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerification