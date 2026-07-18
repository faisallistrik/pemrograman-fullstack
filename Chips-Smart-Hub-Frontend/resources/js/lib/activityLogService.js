import apiClient from './api'

const activityLogService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/activity-logs', { params })
    return response.data
  },
}

export default activityLogService
