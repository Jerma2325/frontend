<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card-text>
   
      <v-text-field
        v-model="username"
        label="Username"
        prepend-icon="mdi-account"
        :rules="[rules.required]"
        required
      ></v-text-field>
  
      <v-text-field
        v-model="email"
        label="Email"
        prepend-icon="mdi-email"
        :rules="[rules.required, rules.email]"
        required
      ></v-text-field>
     
      <v-text-field
        v-model="password"
        label="Password"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        :rules="[rules.required, rules.password]"
        required
        @click:append="showPassword = !showPassword"
      ></v-text-field>
    
      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        prepend-icon="mdi-lock-check"
        :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showConfirmPassword ? 'text' : 'password'"
        :rules="[rules.required, passwordMatch]"
        required
        @click:append="showConfirmPassword = !showConfirmPassword"
      ></v-text-field>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-3"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        type="submit"
        :loading="loading"
        :disabled="!valid || loading"
      >
        Register
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const valid = ref(false)
const form = ref(null)

const authStore = useAuthStore()
const router = useRouter()

const loading = computed(() => authStore.loading)
const errorMessage = computed(() => authStore.error)

const passwordMatch = (v) => {
  return v === password.value || 'Passwords do not match'
}


const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Email must be valid',
  password: v => v.length >= 8 || 'Password must be at least 8 characters'
}

const submitForm = async () => {
  if (!valid.value) return
  
  try {
    console.log('Submitting registration form with data:', {
      username: username.value,
      email: email.value,
      password: '***'
    })
    
    const success = await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    
    console.log('Registration result:', success)
    
    if (success) {
      setTimeout(() => {
        console.log('Navigating to dashboard...')
        router.push({ name: 'dashboard' })
      }, 500)
    }
  } catch (error) {
    console.error('Registration form error:', error)
  }
}
</script>