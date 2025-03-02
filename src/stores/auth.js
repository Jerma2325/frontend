// // src/stores/auth.js
// import { defineStore } from 'pinia'
// import apiClient from '../plugins/axios'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     token: localStorage.getItem('token') || null,
//     loading: false,
//     error: null
//   }),
  
//   getters: {
//     isAuthenticated: (state) => !!state.token,
//     getUser: (state) => state.user,
//     getError: (state) => state.error
//   },
  
//   actions: {
//     async register(userData) {
//       this.loading = true
//       this.error = null
      
//       try {
//         console.log('Attempting to register with data:', userData)
//         const response = await apiClient.post('/auth/register', userData)
        
//         if (response.data.token) {
//           this.token = response.data.token
//           this.user = response.data.user
//           localStorage.setItem('token', response.data.token)
//           return true
//         }
//       } catch (error) {
//         console.error('Register error:', error)
//         this.error = error.response?.data?.message || error.message || 'Registration failed'
//         return false
//       } finally {
//         this.loading = false
//       }
//     },
    
//     async login(credentials) {
//       this.loading = true
//       this.error = null
      
//       try {
//         const response = await apiClient.post('/auth/login', credentials)
        
//         if (response.data.token) {
//           this.token = response.data.token
//           this.user = response.data.user
//           localStorage.setItem('token', response.data.token)
//           return true
//         }
//       } catch (error) {
//         this.error = error.response?.data?.message || 'Login failed'
//         return false
//       } finally {
//         this.loading = false
//       }
//     },
    
//     logout() {
//       this.user = null
//       this.token = null
//       localStorage.removeItem('token')
//     },
    
//     async fetchUserProfile() {
//       if (!this.token) return
      
//       this.loading = true
      
//       try {
//         console.log('Attempting to fetch user profile with token:', this.token ? 'Token exists' : 'No token')
        
//         const response = await apiClient.get('/auth/profile')
//         this.user = response.data
//         console.log('Profile fetched successfully:', this.user)
//       } catch (error) {
//         console.error('Failed to fetch user profile:', error)
//         // If the token is invalid or expired log the user out
//         if (error.response?.status === 401 || error.response?.status === 404) {
//           console.log('Authentication issue detected, logging out')
//           this.logout()
//         }
//       } finally {
//         this.loading = false
//       }
//     },

//     // New method to get the current user's ETH address
//     getUserEthAddress() {
//       return this.user?.ethAddress || null
//     }
//   }
// })
// src/stores/auth.js
import { defineStore } from 'pinia'
import apiClient from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getError: (state) => state.error
  },
  
  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        console.log('Attempting to register with data:', userData)
        const response = await apiClient.post('/api/auth/register', userData)
        
        if (response.data.token) {
          console.log('Registration successful, received token')
          this.token = response.data.token
          this.user = response.data.user
          
          // Set token in localStorage and axios default headers
          localStorage.setItem('token', response.data.token)
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
          console.log('Token stored in localStorage and set in axios defaults')
          
          return true
        }
      } catch (error) {
        console.error('Register error:', error)
        this.error = error.response?.data?.error || error.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        console.log('Attempting to login with credentials:', {
          username: credentials.username,
          password: '***'
        })
        
        const response = await apiClient.post('/api/auth/login', credentials)
        console.log('Login response received:', response.status)
        
        if (response.data && response.data.token) {
          console.log('Login successful, received token')
          this.token = response.data.token
          this.user = response.data.user
          
          // Set token in localStorage and axios default headers
          localStorage.setItem('token', response.data.token)
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
          console.log('Token stored in localStorage and set in axios defaults')
          
          // Check if token was properly stored
          setTimeout(() => {
            const storedToken = localStorage.getItem('token')
            console.log('Token in localStorage after login:', storedToken ? 'Present' : 'Missing')
            console.log('Authorization header in axios:', apiClient.defaults.headers.common['Authorization'] ? 'Present' : 'Missing')
          }, 100)
          
          return true
        } else {
          console.error('Login response missing token:', response.data)
          this.error = 'Login response missing token'
          return false
        }
      } catch (error) {
        console.error('Login error:', error)
        this.error = error.response?.data?.error || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      console.log('Logging out user')
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete apiClient.defaults.headers.common['Authorization']
      console.log('Token removed from localStorage and axios defaults')
    },
    
    async fetchUserProfile() {
      if (!this.token) {
        console.log('No token available, cannot fetch user profile')
        return null
      }
      
      this.loading = true
      
      try {
        console.log('Fetching user profile')
        const storedToken = localStorage.getItem('token')
        console.log('Token in localStorage:', storedToken ? 'Present' : 'Missing')
        
        // Ensure authorization header is set
        const headers = { 'Authorization': `Bearer ${this.token}` }
        console.log('Using Authorization header:', headers.Authorization)
        
        const response = await apiClient.get('/api/auth/profile', { headers })
        console.log('Profile response received:', response.status)
        
        this.user = response.data
        console.log('Profile fetched successfully:', this.user)
        return this.user
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // if the token is invalid or expired log the user out
        if (error.response?.status === 401 || error.response?.status === 404) {
          console.log('Authentication issue detected, logging out')
          this.logout()
        }
        return null
      } finally {
        this.loading = false
      }
    },

    // Get the current user's ETH address
    getUserEthAddress() {
      return this.user?.ethAddress || null
    }
  }
})