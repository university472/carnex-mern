import api from './api'

export async function submitSourcingRequest(data) {
  const response = await api.post('/sourcing', data)
  return response.data
}
