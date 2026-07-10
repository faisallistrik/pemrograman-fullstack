import apiClient from './api'

const roomService = {
  // Get all rooms
  getAll: async (params = {}) => {
    const response = await apiClient.get('/rooms', { params })
    return response.data
  },

  // Get single room
  getById: async (id) => {
    const response = await apiClient.get(`/rooms/${id}`)
    return response.data
  },

  // Create room
  create: async (data) => {
    const response = await apiClient.post('/rooms', data)
    return response.data
  },

  // Update room
  update: async (id, data) => {
    const response = await apiClient.put(`/rooms/${id}`, data)
    return response.data
  },

  // Delete room
  delete: async (id) => {
    const response = await apiClient.delete(`/rooms/${id}`)
    return response.data
  },
}

export default roomService
