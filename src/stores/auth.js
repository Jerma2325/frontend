// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.post('/api/auth/register', userData)
        
        if (response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          
          localStorage.setItem('token', response.data.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
          
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
        console.log('Attempting to login with credentials')
        const response = await axios.post('/api/auth/login', credentials)
        
        if (response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          
          localStorage.setItem('token', response.data.token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
          
          return true
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      
      // Hard reload to clear any cached state
      window.location.href = '/'
    },
    
    async fetchUserProfile() {
      if (!this.token) return null
      
      this.loading = true
      
      try {
        console.log('Fetching fresh user profile with token')
        
        const response = await axios.get('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })
        
        this.user = response.data
        console.log('Profile fetched successfully:', this.user)
        return this.user
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        if (error.response?.status === 401 || error.response?.status === 404) {
          console.log('Authentication issue detected, logging out')
          this.logout()
        }
        return null
      } finally {
        this.loading = false
      }
    },

    getUserEthAddress() {
      return this.user?.ethAddress || null
    }
  }
})