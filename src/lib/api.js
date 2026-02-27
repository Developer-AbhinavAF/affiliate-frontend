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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const url = err?.config?.baseURL ? `${err.config.baseURL}${err.config.url}` : err?.config?.url
    console.error('API request failed', { status, url, data: err?.response?.data })
    return Promise.reject(err)
  }
)
