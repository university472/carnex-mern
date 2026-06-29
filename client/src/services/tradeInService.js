import api from './api'

export async function submitTradeInRequest(data) {
  const response = await api.post('/trade-in', data)
  return response.data
}
  