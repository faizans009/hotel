import React from 'react'
import { Provider } from 'jotai'

const AuthProvider = ({ children }) => {
    return (
        <Provider>
            {children}
        </Provider>
    )
}

export default AuthProvider
