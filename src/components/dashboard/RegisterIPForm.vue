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
          :disabled="!valid || loading"
          prepend-icon="mdi-content-save"
        >
          Register
        </v-btn>
      </v-card-actions>
    </v-form>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIPStore } from '../../stores/ip'
  
  const name = ref('')
  const description = ref('')
  const file = ref(null)
  const fileInfo = ref({ type: '', size: 0, formattedSize: '' })
  const valid = ref(false)
  const form = ref(null)
  const successMessage = ref('')
  
  const ipStore = useIPStore()
  const router = useRouter()
  
  const loading = computed(() => ipStore.getLoading)
  const errorMessage = computed(() => ipStore.getError)
  
 
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
  
  if (!valid.value || !file.value || !file.value[0]) {
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
    fileType: file.value[0].type,
    fileName: file.value[0].name
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

  
  </script>