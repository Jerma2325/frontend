<template>
    <v-card class="mb-6">
      <v-card-title>Wallet Management</v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="generate">Generate New Wallet</v-tab>
          <v-tab value="import">Import Existing Wallet</v-tab>
        </v-tabs>
        
        <v-window v-model="tab" class="mt-4">
          <v-window-item value="generate">
            <v-form @submit.prevent="generateWallet" ref="generateForm" v-model="generateValid">
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                {{ error }}
              </v-alert>
              
              <v-alert
                v-if="success"
                type="success"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                {{ success }}
              </v-alert>
              
              <v-text-field
                v-model="password"
                label="Encryption Password"
                type="password"
                :rules="[rules.required, rules.passwordStrength]"
                hint="This password will encrypt your private key"
                persistent-hint
              ></v-text-field>
              
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                :rules="[rules.required, rules.passwordMatch]"
              ></v-text-field>
              
              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!generateValid || loading"
                >
                  Generate Wallet
                </v-btn>
              </div>
            </v-form>
          </v-window-item>
          
          <v-window-item value="import">
            <v-form @submit.prevent="importWallet" ref="importForm" v-model="importValid">
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                {{ error }}
              </v-alert>
              
              <v-alert
                v-if="success"
                type="success"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                {{ success }}
              </v-alert>
              
              <v-text-field
                v-model="privateKey"
                label="Private Key"
                :rules="[rules.required, rules.validPrivateKey]"
                hint="Your Ethereum private key (starts with 0x)"
                persistent-hint
              ></v-text-field>
              
              <v-text-field
                v-model="password"
                label="Encryption Password"
                type="password"
                :rules="[rules.required, rules.passwordStrength]"
                hint="This password will encrypt your private key"
                persistent-hint
              ></v-text-field>
              
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                :rules="[rules.required, rules.passwordMatch]"
              ></v-text-field>
              
              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!importValid || loading"
                >
                  Import Wallet
                </v-btn>
              </div>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '../../stores/auth';
  
  const authStore = useAuthStore();
  
  const tab = ref('generate');
  const generateValid = ref(false);
  const importValid = ref(false);
  const password = ref('');
  const confirmPassword = ref('');
  const privateKey = ref('');
  const loading = ref(false);
  const error = ref('');
  const success = ref('');
  const generateForm = ref(null);
  const importForm = ref(null);
  
  const rules = {
    required: v => !!v || 'This field is required',
    passwordStrength: v => (v && v.length >= 8) || 'Password must be at least 8 characters',
    passwordMatch: v => v === password.value || 'Passwords do not match',
    validPrivateKey: v => /^(0x)?[0-9a-fA-F]{64}$/.test(v) || 'Invalid private key format'
  };
  
  async function generateWallet() {
    if (!generateValid.value) return;
    
    loading.value = true;
    error.value = '';
    success.value = '';
    
    try {
      const response = await axios.post('/api/wallet/generate', {
        password: password.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      success.value = `Wallet generated successfully! Your address: ${response.data.address}`;
      
      await authStore.fetchUserProfile();
      
      password.value = '';
      confirmPassword.value = '';
      if (generateForm.value) {
        generateForm.value.reset();
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to generate wallet';
    } finally {
      loading.value = false;
    }
  }
  
  async function importWallet() {
    if (!importValid.value) return;
    
    loading.value = true;
    error.value = '';
    success.value = '';
    
    try {
      const response = await axios.post('/api/wallet/import', {
        privateKey: privateKey.value,
        password: password.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      success.value = `Wallet imported successfully! Your address: ${response.data.address}`;
      
      await authStore.fetchUserProfile();
      
      privateKey.value = '';
      password.value = '';
      confirmPassword.value = '';
      if (importForm.value) {
        importForm.value.reset();
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to import wallet';
    } finally {
      loading.value = false;
    }
  }
  </script>