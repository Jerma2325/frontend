<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" lg="6" class="mx-auto">
          <v-card elevation="3">
            <v-card-title class="text-h5 py-4 px-6">
              Transfer IP
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text v-if="loading" class="text-center py-6">
              <v-progress-circular
                indeterminate
                color="primary"
                class="mb-3"
              ></v-progress-circular>
              <p>Loading IP details...</p>
            </v-card-text>
            
            <v-alert
              v-else-if="error"
              type="error"
              variant="tonal"
              class="ma-4"
            >
              {{ error }}
              <div class="mt-3">
                <v-btn color="primary" :to="{ name: 'dashboard' }">
                  Dashboard
                </v-btn>
              </div>
            </v-alert>
            
            <TransferIPForm
              v-else-if="currentIP"
              :intellectual-property="currentIP"
            />
            
            <v-card-text v-else class="text-center py-6">
              <p>No intellectual property found with the specified ID.</p>
              <v-btn
                color="primary"
                :to="{ name: 'dashboard' }"
                class="mt-3"
              >
                Dashboard
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useIPStore } from '../stores/ip'
  import TransferIPForm from '../components/dashboard/TransferIPForm.vue'
  
  const route = useRoute()
  const ipStore = useIPStore()

  const ipId = route.params.id
 
  const currentIP = computed(() => ipStore.getCurrentIP)
  const loading = computed(() => ipStore.getLoading)
  const error = computed(() => ipStore.getError)
  
  onMounted(async () => {
    if (ipId) {
      await ipStore.fetchIPById(ipId)
    }
  })
  </script>