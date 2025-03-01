<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 mb-4">Your Intellectual Properties</h2>
          
          <v-card v-if="loading" class="pa-4 text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              class="mb-3"
            ></v-progress-circular>
            <p>Loading your intellectual properties...</p>
          </v-card>
          
          <v-alert
            v-else-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ error }}
          </v-alert>
          
          <v-alert
            v-else-if="intellectualProperties.length === 0"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            You don't have any registered intellectual properties yet.
            <v-btn
              color="primary"
              variant="text"
              :to="{ name: 'register-ip' }"
              class="ms-2"
            >
              Register your first IP
            </v-btn>
          </v-alert>
          
          <IPList
            v-else
            :intellectual-properties="intellectualProperties"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, computed } from 'vue'
  import { useIPStore } from '../stores/ip'
  import IPList from '../components/dashboard/IPList.vue'
  
  const ipStore = useIPStore()
  
  const intellectualProperties = computed(() => ipStore.getIPs)
  const loading = computed(() => ipStore.getLoading)
  const error = computed(() => ipStore.getError)
  
  onMounted(() => {
    ipStore.fetchAllIPs()
  })
  </script>