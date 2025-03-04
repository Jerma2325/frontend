<template>
  <v-app>
    <!-- Only show AppBar when user is authenticated -->
    <AppBar v-if="isAuthenticated" />
    
    <!-- Only show SideBar when user is authenticated -->
    <SideBar v-if="isAuthenticated" />
    
    <v-main :class="{ 'ml-250': isAuthenticated }">
      <router-view />
    </v-main>
    
    <!-- Always show Footer -->
    <Footer />
  </v-app>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

// Import layout components
import AppBar from './components/layout/AppBar.vue'
import SideBar from './components/layout/SideBar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Check authentication on route change
watch(
  () => route.path,
  () => {
    if (isAuthenticated.value && !authStore.getUser) {
      authStore.fetchUserProfile()
    }
  }
)

onMounted(() => {
  // Fetch user profile if authenticated
  if (isAuthenticated.value) {
    authStore.fetchUserProfile()
  }
})
</script>

<style>
/* Add this style to ensure proper offset when sidebar is present */
.ml-250 {
  margin-left: 250px;
}
</style>