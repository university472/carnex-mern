import api from './api'

export async function submitFinanceApplication(data) {
  const response = await api.post('/finance', data)
  return response.data
}
