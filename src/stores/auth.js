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
        const response = await apiClient.post('/auth/register', userData)
        
        if (response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          localStorage.setItem('token', response.data.token)
          return true
        }
      } catch (error) {
        console.error('Register error:', error)
        this.error = error.response?.data?.message || error.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiClient.post('/auth/login', credentials)
        
        if (response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          localStorage.setItem('token', response.data.token)
          return true
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
    
    async fetchUserProfile() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        console.log('Attempting to fetch user profile with token:', this.token ? 'Token exists' : 'No token')
        
        const response = await apiClient.get('/auth/profile')
        this.user = response.data
        console.log('Profile fetched successfully:', this.user)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // if the token is invalid or expired log the user out
        if (error.response?.status === 401 || error.response?.status === 404) {
          console.log('Authentication issue detected, logging out')
          this.logout()
        }
      } finally {
        this.loading = false
      }
    }
  }
})