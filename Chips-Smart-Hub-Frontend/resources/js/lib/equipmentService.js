import apiClient from './api'

const equipmentService = {
  // Get all equipment
  getAll: async (params = {}) => {
    const response = await apiClient.get('/equipment', { params })
    return response.data
  },

  // Get single equipment
  getById: async (id) => {
    const response = await apiClient.get(`/equipment/${id}`)
    return response.data
  },

  // Create equipment
  create: async (data) => {
    const response = await apiClient.post('/equipment', data)
    return response.data
  },

  // Update equipment
  update: async (id, data) => {
    const response = await apiClient.put(`/equipment/${id}`, data)
    return response.data
  },

  // Delete equipment
  delete: async (id) => {
    const response = await apiClient.delete(`/equipment/${id}`)
    return response.data
  },
}

export default equipmentService
