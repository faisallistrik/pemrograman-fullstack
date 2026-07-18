import apiClient from './api'

const bookingService = {
  // Get all bookings
  getAll: async (params = {}) => {
    const response = await apiClient.get('/bookings', { params })
    return response.data
  },

  // Get single booking
  getById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`)
    return response.data
  },

  // Create booking
  create: async (data) => {
    const response = await apiClient.post('/bookings', data)
    return response.data
  },

  // Update booking
  update: async (id, data) => {
    const response = await apiClient.put(`/bookings/${id}`, data)
    return response.data
  },

  // Delete booking
  delete: async (id) => {
    const response = await apiClient.delete(`/bookings/${id}`)
    return response.data
  },

  // Check-in booking
  checkIn: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/check-in`)
    return response.data
  },

  // Approve booking (admin)
  approve: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/approve`)
    return response.data
  },

  // Reject/cancel booking (admin)
  reject: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/reject`)
    return response.data
  },

  // Mark booking as completed / returned
  complete: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/complete`)
    return response.data
  },
}

export default bookingService
