import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
})

// Audit
export const analyzeRoom = (formData) =>
  api.post('/audit/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Interview
export const generateInterview = (auditId) =>
  api.get(`/interview/generate/${auditId}`)

export const submitAnswers = (interviewId, answers) =>
  api.post('/interview/submit', {
    interview_id: interviewId,
    answers,
  })

// Dashboard
export const getHistory = () => api.get('/dashboard/history')
export const getRecord = (auditId) => api.get(`/dashboard/record/${auditId}`)