<template>
  <v-navigation-drawer
    permanent
    location="left"
    width="250"
  >
    <v-list>
      <v-list-item
        :prepend-avatar="user?.avatar || 'https://cdn.vuetifyjs.com/images/john.png'"
        :title="user?.username || 'User'"
        :subtitle="user?.email || 'user@example.com'"
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-logout"
            variant="text"
            size="small"
            color="error"
            @click="logout"
            title="Logout"
          ></v-btn>
        </template>
      </v-list-item>
      
      <v-list-item v-if="user?.ethAddress">
        <template v-slot:prepend>
          <v-icon icon="mdi-ethereum" />
        </template>
        <v-tooltip activator="parent" location="bottom">
          {{ user.ethAddress }}
        </v-tooltip>
        <div class="text-truncate">{{ truncatedAddress }}</div>
      </v-list-item>
    </v-list>
    
    <v-divider></v-divider>
    
    <v-list density="compact" nav>
      <v-list-item
        :to="{ name: 'dashboard' }"
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
      ></v-list-item>
      
      <v-list-item
        :to="{ name: 'register-ip' }"
        prepend-icon="mdi-plus-circle"
        title="Register New IP"
        value="register-ip"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.getUser)

const truncatedAddress = computed(() => {
  if (!user.value?.ethAddress) return '';
  
  const address = user.value.ethAddress;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
})

const logout = () => {
  console.log('Logging out from sidebar...')
  authStore.logout()
  router.push({ name: 'home' })
}
</script>