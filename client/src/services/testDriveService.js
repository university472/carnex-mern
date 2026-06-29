import api from './api'

export async function submitTestDriveRequest(data) {
  const response = await api.post('/test-drive', data)
  return response.data
}
