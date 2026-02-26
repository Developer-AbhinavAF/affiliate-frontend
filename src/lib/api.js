import axios from 'axios'

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'https://affiliate-backend-8gbe.onrender.com').replace(
  /\/$/,
  ''
)

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
