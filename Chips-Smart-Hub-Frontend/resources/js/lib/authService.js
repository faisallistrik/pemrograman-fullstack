import apiClient from './api'

const authService = {
  // Login
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password })
    const { access_token, user } = response.data
    
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    
    return { token: access_token, user }
  },

  // Register
  register: async (name, email, password) => {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
    })
    const { access_token, user } = response.data
    
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    
    return { token: access_token, user }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('auth_user')
    return user ? JSON.parse(user) : null
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token')
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('auth_token')
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await apiClient.post('/forgot-password', { email })
    return response.data
  },

  // Reset password with token
  resetPassword: async (email, token, password, password_confirmation) => {
    const response = await apiClient.post('/reset-password', {
      email,
      token,
      password,
      password_confirmation,
    })
    return response.data
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/me')
      return response.data
    } catch (error) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      return null
    }
  },
}

export default authService
