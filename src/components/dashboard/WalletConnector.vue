<template>
    <div>
      <v-card v-if="!isConnected" class="mb-4 pa-4">
        <v-card-title>Connect Your Wallet</v-card-title>
        <v-card-text>
          <p>Connect your Ethereum wallet to perform transactions.</p>
          <v-btn 
            color="primary" 
            @click="connectWallet" 
            :loading="connecting"
          >
            Connect Wallet
          </v-btn>
        </v-card-text>
      </v-card>
      
      <v-card v-else class="mb-4 pa-4">
        <v-card-title class="text-subtitle-1">Wallet Connected</v-card-title>
        <v-card-text>
          <v-chip class="mb-2" color="success" label>
            <v-icon start icon="mdi-check-circle"></v-icon>
            Connected
          </v-chip>
          <div class="d-flex align-center">
            <span class="text-body-2 text-grey me-2">Address:</span>
            <span class="text-body-2 text-truncate">{{ walletAddress }}</span>
            <v-btn icon size="small" class="ms-1" @click="copyAddress">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </div>
          <div class="mt-2">
            <v-btn 
              color="error" 
              variant="outlined" 
              size="small"
              @click="disconnectWallet"
            >
              Disconnect
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import detectEthereumProvider from '@metamask/detect-provider';
  import { useAuthStore } from '../../stores/auth';
  
  const authStore = useAuthStore();
  const walletAddress = ref('');
  const connecting = ref(false);
  const providerDetected = ref(false);
  const provider = ref(null);
  
  const isConnected = computed(() => {
    return !!walletAddress.value;
  });
  
  onMounted(async () => {
    try {
      provider.value = await detectEthereumProvider();
      if (provider.value) {
        providerDetected.value = true;
        checkConnection();
      }
    } catch (error) {
      console.error('Error detecting provider:', error);
    }
  });
  
  async function checkConnection() {
    if (provider.value && provider.value.selectedAddress) {
      walletAddress.value = provider.value.selectedAddress;
      await syncAddressWithBackend();
    }
  }
  
  async function connectWallet() {
    if (!providerDetected.value) {
      alert('No Ethereum wallet detected. Please install MetaMask or another Ethereum wallet.');
      window.open('https://metamask.io/download.html', '_blank');
      return;
    }
  
    connecting.value = true;
  
    try {
      const accounts = await provider.value.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        walletAddress.value = accounts[0];
        await syncAddressWithBackend();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + (error.message || 'Unknown error'));
    } finally {
      connecting.value = false;
    }
  }
  
  async function disconnectWallet() {
    walletAddress.value = '';
  }
  
  async function syncAddressWithBackend() {
    if (!walletAddress.value) return;
    
    try {
      await authStore.updateWalletAddress(walletAddress.value);
    } catch (error) {
      console.error('Failed to sync wallet address with backend:', error);
    }
  }
  
  function copyAddress() {
    navigator.clipboard.writeText(walletAddress.value);
  }
  </script>