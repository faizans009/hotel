import { useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useAtom } from "jotai"
import { message } from "antd"
import Home from "./pages/Home"
import HotelDetails from "./pages/HotelDetails"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import OtpVerification from "./pages/OtpVerification"
import { userAtom } from "./store/atoms"
import { authAPI } from "./services/api"

/**
 * Debug component to view Jotai state
 * Shows user state in bottom-right corner (like Redux DevTools)
 */
function DebugState() {
  const [user] = useAtom(userAtom)
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#1a1a1a',
      color: '#00ff00',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '11px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      border: '1px solid #00ff00'
    }}>
      <strong>📊 Jotai State:</strong>
      <pre>{JSON.stringify({ user }, null, 2)}</pre>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/hotel-details",
    element: <HotelDetails />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-otp",
    element: <OtpVerification />,
  },
])

function AppWithAuth() {
  const [, setUser] = useAtom(userAtom)

  useEffect(() => {
    // Check auth in background without blocking UI
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser()
        if (response.data?.user) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.log('User not authenticated on app load')
      }
    }

    checkAuth()
  }, [setUser])

  return (
    <>
      <RouterProvider router={router} />
      <DebugState />
    </>
  )
}

export default AppWithAuth
