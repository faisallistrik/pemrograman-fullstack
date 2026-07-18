import apiClient from './api'

const notificationService = {
  getAll: async () => {
    const response = await apiClient.get('/notifications')
    return response.data
  },

  markAsRead: async (id) => {
    const response = await apiClient.post(`/notifications/${id}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/read-all')
    return response.data
  },
}

export default notificationService
