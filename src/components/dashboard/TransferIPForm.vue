<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-card-text>
      <v-alert
        type="info"
        variant="tonal"
        class="mb-4"
      >
        You are about to transfer ownership of <strong>{{ intellectualProperty.name }}</strong> to another blockchain address.
        This action cannot be undone.
      </v-alert>
      
      <v-text-field
        v-model="ipId"
        label="IP ID"
        prepend-icon="mdi-identifier"
        readonly
        disabled
      ></v-text-field>

      <v-text-field
        v-model="currentOwner"
        label="Current Owner"
        prepend-icon="mdi-account"
        readonly
        disabled
      ></v-text-field>
      
      <v-text-field
        v-model="newOwnerAddress"
        label="New Owner Address (Ethereum)"
        prepend-icon="mdi-ethereum"
        :rules="[rules.required, rules.ethAddress]"
        hint="The Ethereum address of the new owner (starts with 0x)"
        persistent-hint
        required
      ></v-text-field>
      
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-3 mt-3"
      >
        {{ errorMessage }}
      </v-alert>

      <v-alert
        v-if="successMessage"
        type="success"
        variant="tonal"
        class="mb-3 mt-3"
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
        color="error"
        type="submit"
        :loading="loading"
        :disabled="!valid || loading"
        prepend-icon="mdi-send"
      >
        Transfer Ownership
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useIPStore } from '../../stores/ip'

const props = defineProps({
  intellectualProperty: {
    type: Object,
    required: true
  }
})

const ipId = ref('')
const currentOwner = ref('')
const newOwnerAddress = ref('')
const valid = ref(false)
const form = ref(null)
const successMessage = ref('')

const ipStore = useIPStore()
const router = useRouter()

const loading = computed(() => ipStore.getLoading)
const errorMessage = computed(() => ipStore.getError)

const rules = {
  required: v => !!v || 'This field is required',
  ethAddress: v => /^0x[a-fA-F0-9]{40}$/.test(v) || 'Must be a valid Ethereum address'
}

onMounted(() => {
  if (props.intellectualProperty) {
    ipId.value = props.intellectualProperty.id || ''
    currentOwner.value = props.intellectualProperty.ownerUsername 
      ? `${props.intellectualProperty.ownerUsername} (${props.intellectualProperty.ownerAddress})`
      : props.intellectualProperty.ownerAddress || ''
  }
})

const submitForm = async () => {
  if (!valid.value) return
  
  try {
    console.log('Submitting transfer form with data:', {
      ipId: ipId.value,
      newOwnerAddress: newOwnerAddress.value
    })
    
    const result = await ipStore.transferIP(
      ipId.value, 
      { newOwnerAddress: newOwnerAddress.value }
    )
    
    console.log('Transfer result:', result)
    
    if (result) {
      successMessage.value = 'Intellectual property transferred successfully!'
      
      setTimeout(() => {
        router.push({ name: 'dashboard' })
      }, 2000)
    }
  } catch (error) {
    console.error('Transfer form error:', error)
  }
}
</script>