<template>
  <v-card class="h-100" elevation="3">
    <v-card-title class="text-truncate">
      {{ intellectualProperty.name || 'Untitled IP' }}
    </v-card-title>
    
    <v-card-subtitle class="d-flex align-center">
      <v-icon size="small" class="me-1">mdi-calendar</v-icon>
      {{ formattedDate }}
    </v-card-subtitle>
    
    <v-divider></v-divider>
    
    <v-card-text>
      <v-row no-gutters align="center" class="mb-2">
        <v-col cols="4" class="text-body-2 text-grey">ID:</v-col>
        <v-col>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="text-truncate d-block text-body-2"
              >
                {{ intellectualProperty.id }}
              </span>
            </template>
            <span>{{ intellectualProperty.id }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      
      <v-row no-gutters align="center" class="mb-2">
        <v-col cols="4" class="text-body-2 text-grey">Type:</v-col>
        <v-col class="text-body-2">
          {{ intellectualProperty.fileType || 'N/A' }}
        </v-col>
      </v-row>
      
      <v-row no-gutters align="center">
        <v-col cols="4" class="text-body-2 text-grey">Status:</v-col>
        <v-col>
          <v-chip
            size="small"
            :color="getStatusColor(intellectualProperty.status)"
            class="text-caption"
            text-color="white"
          >
            {{ intellectualProperty.status || 'PENDING' }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-divider></v-divider>
    
    <v-card-actions>
      <v-btn
        variant="text"
        color="info"
        size="small"
        prepend-icon="mdi-information"
        @click="showDetails = !showDetails"
      >
        Details
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <v-btn
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-swap-horizontal"
        :to="{ name: 'transfer-ip', params: { id: intellectualProperty.id } }"
      >
        Transfer
      </v-btn>
    </v-card-actions>
    
    <v-expand-transition>
      <div v-show="showDetails">
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters align="center" class="mb-2">
            <v-col cols="4" class="text-body-2 text-grey">Owner:</v-col>
            <v-col>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    class="text-truncate d-block text-body-2"
                  >
                    {{ intellectualProperty.ownerUsername }} ({{ intellectualProperty.ownerAddress }})
                  </span>
                </template>
                <span>{{ intellectualProperty.ownerUsername }} ({{ intellectualProperty.ownerAddress }})</span>
              </v-tooltip>
            </v-col>
          </v-row>
          
          <v-row no-gutters align="center" class="mb-2" v-if="intellectualProperty.description">
            <v-col cols="4" class="text-body-2 text-grey">Description:</v-col>
            <v-col class="text-body-2">
              {{ intellectualProperty.description }}
            </v-col>
          </v-row>
          
          <v-row no-gutters align="center" class="mb-2" v-if="intellectualProperty.transactionHash">
            <v-col cols="4" class="text-body-2 text-grey">Transaction:</v-col>
            <v-col>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    class="text-truncate d-block text-body-2"
                  >
                    {{ intellectualProperty.transactionHash }}
                  </span>
                </template>
                <span>{{ intellectualProperty.transactionHash }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
          
          <v-row no-gutters align="center" v-if="intellectualProperty.fileUrl">
              <v-col cols="4" class="text-body-2 text-grey">File:</v-col>
              <v-col>
                <v-btn
                  variant="text"
                  color="success"
                  size="small"
                  prepend-icon="mdi-download"
                  @click="downloadFile"
                >
                  Download
                </v-btn>
              </v-col>
            </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  intellectualProperty: {
    type: Object,
    required: true
  }
})

const showDetails = ref(false)

const formattedDate = computed(() => {
  if (!props.intellectualProperty.createdAt) return 'N/A'
  return new Date(props.intellectualProperty.createdAt).toLocaleDateString()
})

const getStatusColor = (status) => {
  const statusColors = {
    'REGISTERED': 'success',
    'PENDING': 'warning',
    'TRANSFERRED': 'info',
    'REJECTED': 'error'
  }
  
  return statusColors[status] || 'grey'
}

const downloadFile = () => {
    if (!props.intellectualProperty.fileUrl) return
    
    const token = localStorage.getItem('token')
    
    fetch(props.intellectualProperty.fileUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.blob()
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = props.intellectualProperty.fileName || 'download'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    })
    .catch(error => {
      console.error('Error downloading file:', error)
      alert('Failed to download file. Please try again.')
    })
  }
</script>