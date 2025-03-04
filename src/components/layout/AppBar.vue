<template>
  <v-app-bar elevation="2" color="primary">
    <v-app-bar-title>
      ChainD - Secure YOURS intellectual properties
    </v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <v-btn
      icon
      @click="logout"
      title="Logout"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  console.log('Logging out...')
  authStore.logout()
  router.push({ name: 'home' })
}
</script>