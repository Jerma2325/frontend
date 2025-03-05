<template>
  <v-app>
    <AppBar v-if="isAuthenticated" />
    
    <SideBar v-if="isAuthenticated" />
    
    <v-main :class="{ 'ml-250': isAuthenticated }">
      <router-view />
    </v-main>
    
    <Footer />
  </v-app>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

import AppBar from './components/layout/AppBar.vue'
import SideBar from './components/layout/SideBar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

watch(
  () => route.path,
  () => {
    if (isAuthenticated.value && !authStore.getUser) {
      authStore.fetchUserProfile()
    }
  }
)

onMounted(() => {
  if (isAuthenticated.value) {
    authStore.fetchUserProfile()
  }
})
</script>

<style>
.ml-250 {
  margin-left: 250px;
}
</style>