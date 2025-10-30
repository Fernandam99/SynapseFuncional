import api from './api'

// Servicio para consumir endpoints de la API de concentración
// Todas las funciones devuelven la promesa de axios para manejarla desde los componentes

export const getStats = () => api.get('/api/stats').then(r => r.data)

export const getSessions = ({ technique = null, page = 1, per_page = 10 } = {}) => {
  const params = { page, per_page }
  if (technique) params.technique = technique
  return api.get('/api/sessions', { params }).then(r => r.data)
}

export const createSession = (payload) => api.post('/api/sessions', payload).then(r => r.data)

export const getWeeklyProgress = () => api.get('/api/progress/weekly').then(r => r.data)

export const getMonthlyProgress = () => api.get('/api/progress/monthly').then(r => r.data)

export const getTechniqueStats = () => api.get('/api/techniques/stats').then(r => r.data)

export const getInsights = () => api.get('/api/insights').then(r => r.data)

export const healthCheck = () => api.get('/api/health').then(r => r.data)

export default {
  getStats,
  getSessions,
  createSession,
  getWeeklyProgress,
  getMonthlyProgress,
  getTechniqueStats,
  getInsights,
  healthCheck,
}
