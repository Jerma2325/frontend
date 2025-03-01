import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})
const token = localStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

apiClient.interceptors.request.use(
  config => {
    
    if (token) {
      
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error.message)
    
    const { response } = error
    
  
    if (response && (response.status === 401 || response.status === 403)) {
      console.log('Authentication error, removing token')
      localStorage.removeItem('token')
    
    }
    
    return Promise.reject(error)
  }
)

export default apiClient