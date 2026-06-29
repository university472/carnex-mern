import api from './api'

export async function submitContactMessage(data) {
  const response = await api.post('/contact', data)
  return response.data
}
