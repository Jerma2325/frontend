// import axios from 'axios'

// const apiClient = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   timeout: 10000
// })
// const token = localStorage.getItem('token')
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// apiClient.interceptors.request.use(
//   config => {
    
//     if (token) {
      
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error.response || error.message)
    
//     const { response } = error
    
  
//     if (response && (response.status === 401 || response.status === 403)) {
//       console.log('Authentication error, removing token')
//       localStorage.removeItem('token')
    
//     }
    
//     return Promise.reject(error)
//   }
// )

// export default apiClient

import axios from 'axios'

// Create Axios instance
const apiClient = axios.create({
  baseURL: '', // Empty baseURL to use absolute paths
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    
  },
  timeout: 1000000
})



// Request interceptor

  apiClient.interceptors.request.use(
    config => {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      // Log for debugging
      console.log(`Request to ${config.url}`)
      console.log('Token in localStorage:', token ? 'Present' : 'Missing')
      
      // Add Authorization header if token exists
      if (token) {
        console.log('Adding Authorization header with Bearer token')
        config.headers['Authorization'] = `Bearer ${token}`
      }
      
      // Log final headers
      console.log('Request headers:', JSON.stringify(config.headers))
      
      return config
    },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Log response for debugging
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  error => {
    console.error('API Error:', error.response || error.message)
    
    const { response } = error
    
    // Handle authentication errors
    if (response && (response.status === 401 || response.status === 403)) {
      console.log('Authentication error, removing token')
      localStorage.removeItem('token')
      delete apiClient.defaults.headers.common['Authorization']
    }
    
    return Promise.reject(error)
  }
)

export default apiClient