<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card-text>
      <v-text-field
        v-model="name"
        label="Name"
        prepend-icon="mdi-format-title"
        :rules="[rules.required]"
        required
      ></v-text-field>
   
      <v-textarea
        v-model="description"
        label="Description"
        prepend-icon="mdi-text-box"
        rows="3"
        auto-grow
      ></v-textarea>

      <v-text-field
        v-model="ethAddress"
        label="Your Ethereum Address"
        prepend-icon="mdi-ethereum"
        readonly
        disabled
        hint="Your blockchain address that will be registered as the owner"
        persistent-hint
      ></v-text-field>

      <div class="mb-4">
        <label for="file-upload" class="text-subtitle-1 d-block mb-2">
          <v-icon class="me-2">mdi-file-upload</v-icon>
          IP File
          <span class="text-red-darken-2">*</span>
        </label>
        <input
          id="file-upload"
          type="file"
          ref="fileInput"
          class="w-100"
          @change="onFileChange"
        />
        <div class="text-caption text-grey mt-1" v-if="!selectedFile">
          Please select a file to upload
        </div>
        <div class="text-caption text-success mt-1" v-else>
          Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
        </div>
      </div>
 
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-3"
      >
        {{ errorMessage }}
      </v-alert>

      <v-alert
        v-if="successMessage"
        type="success"
        variant="tonal"
        class="mb-3"
      >
        {{ successMessage }}
      </v-alert>
    </v-card-text>
    
    <v-card-actions class="pb-6 px-6">
      <v-btn
        variant="text"
        color="secondary"
        :to="{ name: 'dashboard' }"
        :disabled="loading"
      >
        Cancel
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <v-btn
        color="info"
        @click="refreshUser"
        :disabled="loading"
        prepend-icon="mdi-refresh"
        class="mr-2"
      >
        Refresh User
      </v-btn>
      
      <v-btn
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!valid || loading || !selectedFile || !ethAddress"
        prepend-icon="mdi-content-save"
      >
        Register
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIPStore } from '../../stores/ip'
import { useAuthStore } from '../../stores/auth'
import axios from 'axios'

const name = ref('')
const description = ref('')
const ethAddress = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const valid = ref(false)
const form = ref(null)
const successMessage = ref('')

const ipStore = useIPStore()
const authStore = useAuthStore()
const router = useRouter()

const loading = computed(() => ipStore.getLoading || authStore.loading)
const errorMessage = computed(() => ipStore.getError || authStore.getError)


const refreshUser = async () => {
  console.log("Manually refreshing user data...")
  
  ethAddress.value = ''
  
  try {
    const userData = await authStore.fetchUserProfile()
    if (userData && userData.ethAddress) {
      ethAddress.value = userData.ethAddress
      console.log("User data refreshed. Current ETH address:", ethAddress.value)
    }
  } catch (error) {
    console.error("Error refreshing user data:", error)
  }
}

onMounted(async () => {
  console.log("Component mounted, fetching user profile...")
  await refreshUser()
})

const rules = {
  required: v => !!v || 'This field is required'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

const onFileChange = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    selectedFile.value = event.target.files[0]
    console.log("File selected:", selectedFile.value)
  } else {
    selectedFile.value = null
  }
}

const submitForm = async () => {
  console.log("Form submission started")
  
  if (!selectedFile.value || !ethAddress.value) {
    console.log("No file selected or no ETH address available")
    return
  }
  
  const formData = new FormData()
  
  formData.append('name', name.value)
  if (description.value) {
    formData.append('description', description.value)
  }
  
  formData.append('file', selectedFile.value)
  
  console.log("FormData created with:", {
    name: name.value,
    fileSelected: selectedFile.value.name,
    userAddress: ethAddress.value
  })
  
  try {
    console.log("Sending request to backend...")
    
    const response = await axios({
      method: 'post',
      url: '/api/intellectual-properties',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    console.log("IP Registration successful:", response.data)
    successMessage.value = 'Intellectual property registered successfully!'
    
    setTimeout(() => {
      router.push({ name: 'dashboard' })
    }, 2000)
  } catch (error) {
    console.error('Error registering IP:', error)
  }
}
</script>