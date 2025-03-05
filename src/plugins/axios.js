import axios from 'axios'


const apiClient = axios.create({
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    
  },
  timeout: 1000000
})




  apiClient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token')
      
      console.log(`Request to ${config.url}`)
      console.log('Token in localStorage:', token ? 'Present' : 'Missing')
      
      if (token) {
        console.log('Adding Authorization header with Bearer token')
        config.headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log('Request headers:', JSON.stringify(config.headers))
      
      return config
    },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  error => {
    console.error('API Error:', error.response || error.message)
    
    const { response } = error
    
    if (response && (response.status === 401 || response.status === 403)) {
      console.log('Authentication error, removing token')
      localStorage.removeItem('token')
      delete apiClient.defaults.headers.common['Authorization']
    }
    
    return Promise.reject(error)
  }
)

export default apiClient