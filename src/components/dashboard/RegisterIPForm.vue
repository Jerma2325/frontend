<!-- <template>
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

      <v-file-input
        v-model="file"
        accept="*/*"
        label="IP File"
        prepend-icon="mdi-file-upload"
        :rules="[rules.required]"
        required
        show-size
        truncate-length="25"
        @change="onFileChange"
      ></v-file-input>

      <v-alert
        v-if="fileInfo.type"
        type="info"
        variant="tonal"
        class="mb-3"
      >
        <strong>File Type:</strong> {{ fileInfo.type }}<br>
        <strong>File Size:</strong> {{ fileInfo.formattedSize }}
      </v-alert>
 
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
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!valid || loading || !ethAddress"
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

const name = ref('')
const description = ref('')
const ethAddress = ref('')
const file = ref(null)
const fileInfo = ref({ type: '', size: 0, formattedSize: '' })
const valid = ref(false)
const form = ref(null)
const successMessage = ref('')

const ipStore = useIPStore()
const authStore = useAuthStore()
const router = useRouter()

const loading = computed(() => ipStore.getLoading)
const errorMessage = computed(() => ipStore.getError)

// Set the user's Ethereum address when component mounts
onMounted(() => {
  const user = authStore.getUser
  if (user && user.ethAddress) {
    ethAddress.value = user.ethAddress
  } else {
    // Fetch user profile if not available
    authStore.fetchUserProfile().then(() => {
      const updatedUser = authStore.getUser
      if (updatedUser && updatedUser.ethAddress) {
        ethAddress.value = updatedUser.ethAddress
      }
    })
  }
})

const rules = {
  required: v => !!v || 'This field is required'
}

const onFileChange = () => {
  if (!file.value || !file.value[0] || !valid.value) {
    fileInfo.value = { type: '', size: 0, formattedSize: '' }
    return
  }
  
  const selectedFile = file.value[0]
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  fileInfo.value = {
    type: selectedFile.type || 'Unknown',
    size: selectedFile.size,
    formattedSize: formatFileSize(selectedFile.size)
  }
}

const submitForm = async () => {
console.log("Form submission started");
console.log("Form validation status:", valid.value);
console.log("File selected:", file.value);
console.log("eth address",ethAddress.value )

if (!valid.value || !file.value  || !ethAddress.value || file.value.length === 0) {
  console.log("Form validation failed");
  return;
}

const formData = new FormData();

formData.append('name', name.value);
formData.append('description', description.value);
formData.append('file', file.value[0]);

console.log("FormData created with:", {
  name: name.value,
  description: description.value,
  fileType: file.value.type,
  fileName: file.value.name,
  ownerEthAddress: ethAddress.value
});

try {
  console.log("Sending request to IP store");
  const result = await ipStore.registerIP(formData);
  
  console.log("Request completed, result:", result);
  
  if (result) {
    successMessage.value = 'Intellectual property registered successfully!';
    
    setTimeout(() => {
      router.push({ name: 'dashboard' });
    }, 2000);
  }
} catch (error) {
  console.error('Error registering IP:', error);
}
}
</script> -->


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

      <!-- Display current user's ETH address -->
      <v-text-field
        v-model="ethAddress"
        label="Your Ethereum Address"
        prepend-icon="mdi-ethereum"
        readonly
        disabled
        hint="Your blockchain address that will be registered as the owner"
        persistent-hint
      ></v-text-field>

      <!-- Using a vanilla file input for better control -->
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
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!valid || loading || !selectedFile"
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

const loading = computed(() => ipStore.getLoading)
const errorMessage = computed(() => ipStore.getError)

// Set the user's Ethereum address when component mounts
onMounted(() => {
  const user = authStore.getUser
  if (user && user.ethAddress) {
    ethAddress.value = user.ethAddress
  } else {
    // Fetch user profile if not available
    authStore.fetchUserProfile().then(() => {
      const updatedUser = authStore.getUser
      if (updatedUser && updatedUser.ethAddress) {
        ethAddress.value = updatedUser.ethAddress
      }
    })
  }
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
  
  if (!selectedFile.value) {
    console.log("No file selected")
    return
  }
  
  // Create a new FormData object
  const formData = new FormData()
  
  // Add form fields
  formData.append('name', name.value)
  if (description.value) {
    formData.append('description', description.value)
  }
  
  // Add the file - this is the most important part
  formData.append('file', selectedFile.value)
  
  console.log("FormData created with file:", selectedFile.value.name)
  
  try {
    console.log("Sending request to IP store")
    const result = await ipStore.registerIP(formData)
    
    console.log("Request completed, result:", result)
    
    if (result) {
      successMessage.value = 'Intellectual property registered successfully!'
      
      setTimeout(() => {
        router.push({ name: 'dashboard' })
      }, 2000)
    }
  } catch (error) {
    console.error('Error registering IP:', error)
  }
}
</script>