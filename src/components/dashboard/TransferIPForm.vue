<template>
    <v-card class="pa-4" max-width="500" outlined>
      <v-card-title>Transfer IP Ownership</v-card-title>
      <v-card-text>
        <v-form ref="transferForm" v-model="valid" @submit.prevent="submitTransfer">
          <v-text-field
            label="IP Hash"
            v-model="ipHash"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            label="Recipient Address"
            v-model="recipient"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary" :disabled="!valid">Transfer IP</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useIPStore } from '@/stores/ip'
  
  const ipStore = useIPStore()
  const valid = ref(false)
  const ipHash = ref('')
  const recipient = ref('')
  const rules = {
    required: (value) => !!value || 'This field is required',
  }
  
  const submitTransfer = async () => {
    if (!valid.value) return
    try {
      await ipStore.transferIP({ hash: ipHash.value, newOwner: recipient.value })
      ipHash.value = ''
      recipient.value = ''
    } catch (error) {
      console.error('IP Transfer failed:', error)
    }
  }
  </script>
  