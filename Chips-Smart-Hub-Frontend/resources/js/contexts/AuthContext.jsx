import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../lib/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = authService.getToken()
    const storedUser = authService.getCurrentUser()

    if (token && storedUser) {
      setUser(storedUser)
      setAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { user: loggedInUser, token } = await authService.login(email, password)
    setUser(loggedInUser)
    setAuthenticated(true)
    return { user: loggedInUser, token }
  }

  const register = async (name, email, password) => {
    const { user: newUser, token } = await authService.register(name, email, password)
    setUser(newUser)
    setAuthenticated(true)
    return { user: newUser, token }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setAuthenticated(false)
  }

  const value = {
    user,
    loading,
    authenticated,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
