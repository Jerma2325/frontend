<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="10" class="rounded-lg">
          <v-card-title class="text-center text-h4 pt-6 pb-2">
            Blockchain IP Registry
          </v-card-title>
          
          <v-card-text class="text-center pb-4">
            <p class="text-body-1 mb-6">
              Secure your intellectual property on the Ethereum blockchain
            </p>
            
            <v-row justify="center" class="mt-4">
              <template v-if="isAuthenticated">
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    size="large"
                    prepend-icon="mdi-view-dashboard"
                    :to="{ name: 'dashboard' }"
                  >
                    Go to Dashboard
                  </v-btn>
                </v-col>
              </template>
              
              <template v-else>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    size="large"
                    prepend-icon="mdi-login"
                    :to="{ name: 'login' }"
                  >
                    Login
                  </v-btn>
                </v-col>
                
                <v-col cols="auto">
                  <v-btn
                    color="secondary"
                    size="large"
                    prepend-icon="mdi-account-plus"
                    :to="{ name: 'register' }"
                  >
                    Register
                  </v-btn>
                </v-col>
              </template>
            </v-row>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>