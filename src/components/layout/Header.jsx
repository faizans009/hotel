import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import useAuth from '../../hooks/useAuth'

const Header = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuth()

    const handleLogout = async () => {
        try {
            // Call logout endpoint - backend clears HTTP-Only cookies
            await logout()
            message.success('Logged out successfully')
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <h1 className="text-2xl font-bold text-blue-600">HotelBooking</h1>
                </Link>

                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/signup" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
                                Sign Up
                            </Link>
                            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                                Sign In
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-blue-600 !text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
