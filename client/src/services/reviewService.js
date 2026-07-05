import api from './api'

export const submitReview = (formData) =>
  api.post('/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const getApprovedReviews = () => api.get('/reviews')

// Admin
export const getReviews = (params) => api.get('/admin/reviews', { params })
export const approveReview = (id) => api.patch(`/admin/reviews/${id}/approve`)
export const rejectReview = (id) => api.patch(`/admin/reviews/${id}/reject`)
export const toggleVerified = (id) =>
  api.patch(`/admin/reviews/${id}/toggle-verify`)
export const deleteReview = (id) => api.delete(`/admin/reviews/${id}`)
