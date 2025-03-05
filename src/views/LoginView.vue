<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="10" class="rounded-lg">
          <v-card-title class="text-center text-h5 pt-6 pb-2">
            Login
          </v-card-title>
          
          <LoginForm @login-success="onLoginSuccess" />
          
          <v-card-text class="text-center pb-4">
            <p class="text-body-2">
              Don't have an account?
              <v-btn
                variant="text"
                color="primary"
                :to="{ name: 'register' }"
                class="ps-1 pe-1"
              >
                Register
              </v-btn>
            </p>
            
            <p class="text-body-2 mt-3">
              <v-btn
                variant="text"
                color="secondary"
                :to="{ name: 'home' }"
                class="ps-1 pe-1"
              >
                Back to Home
              </v-btn>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()

const onLoginSuccess = () => {
  console.log('Login success event received in LoginView')
  
  setTimeout(() => {
    const token = localStorage.getItem('token')
    console.log('Token in localStorage after login:', token ? 'Present' : 'Missing')
    
    const redirectPath = route.query.redirect || '/dashboard'
    console.log('Redirecting to:', redirectPath)
    router.push(redirectPath)
  }, 500)
}
</script>