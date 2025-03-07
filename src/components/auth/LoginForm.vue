<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card-text>
      <v-text-field
        v-model="username"
        label="Username"
        prepend-icon="mdi-account"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        :rules="[rules.required]"
        required
        @click:append="showPassword = !showPassword"
      ></v-text-field>
  
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-3"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!valid || loading"
      >
        Login
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { useAuthStore } from '../../stores/auth'
import apiClient from '../../plugins/axios'

const emit = defineEmits(['login-success'])

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const valid = ref(false)
const form = ref(null)

const authStore = useAuthStore()

const loading = computed(() => authStore.loading)
const errorMessage = computed(() => authStore.error)

const rules = {
  required: v => !!v || 'This field is required'
}

const submitForm = async () => {
  if (!valid.value) return
  
  try {
    console.log('Submitting login form with data:', {
      username: username.value,
      password: '***'
    })
    
    const success = await authStore.login({
      username: username.value,
      password: password.value
    })
    
    console.log('Login result:', success)
    
    if (success) {
      const token = localStorage.getItem('token')
      console.log('Token after login:', token ? token.substring(0, 20) + '...' : 'Missing')
      
      console.log('Axios default headers:', JSON.stringify(apiClient.defaults.headers.common))
      
      try {
        const testResponse = await apiClient.get('/api/auth/profile')
        console.log('Test profile API call successful:', testResponse.status)
      } catch (error) {
        console.error('Test profile API call failed:', error)
      }
      
      emit('login-success')
    }
  } catch (error) {
    console.error('Login form error:', error)
  }
}
</script>