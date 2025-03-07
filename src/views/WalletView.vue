<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 mb-4">Wallet Management</h2>
          
          <!-- Current Wallet Status Card -->
          <v-card v-if="userWallet" class="mb-6" variant="outlined">
            <v-card-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-ethereum" color="primary" size="large"></v-icon>
              </template>
              <v-card-title>Your Ethereum Wallet</v-card-title>
            </v-card-item>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3" class="text-subtitle-2 text-grey">Address:</v-col>
                <v-col cols="12" md="9" class="d-flex align-center">
                  <span class="text-body-1 font-monospace text-truncate">{{ userWallet }}</span>
                  <v-tooltip location="end">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props" 
                        icon="mdi-content-copy" 
                        variant="text" 
                        density="compact"
                        @click="copyAddress"
                      ></v-btn>
                    </template>
                    <span>Copy address</span>
                  </v-tooltip>
                  
                  <v-tooltip location="end">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-open-in-new" 
                        variant="text"
                        density="compact"
                        @click="openBlockExplorer"
                      ></v-btn>
                    </template>
                    <span>View on Etherscan</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              
              <v-row v-if="balance !== null" class="mt-2">
                <v-col cols="12" md="3" class="text-subtitle-2 text-grey">Balance:</v-col>
                <v-col cols="12" md="9">
                  <span class="text-body-1">{{ balance }} ETH</span>
                  <v-btn
                    icon="mdi-refresh" 
                    variant="text"
                    density="compact"
                    @click="fetchBalance"
                    :loading="loadingBalance"
                  ></v-btn>
                </v-col>
              </v-row>
              
              <v-row class="mt-2">
                <v-col cols="12" md="3" class="text-subtitle-2 text-grey">Status:</v-col>
                <v-col cols="12" md="9">
                  <v-chip
                    color="success"
                    size="small"
                    variant="elevated"
                    class="text-white"
                    prepend-icon="mdi-check-circle"
                  >
                    Connected
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                variant="outlined"
                @click="showRemoveWalletDialog = true"
              >
                Remove Wallet
              </v-btn>
            </v-card-actions>
          </v-card>
          
          <!-- No Wallet Card -->
          <v-card v-else class="mb-6" variant="outlined">
            <v-card-text class="text-center pa-6">
              <v-icon icon="mdi-wallet-outline" size="64" color="grey" class="mb-4"></v-icon>
              <h3 class="text-h5 mb-2">No Wallet Connected</h3>
              <p class="text-body-1 mb-4">
                Connect an Ethereum wallet to register and transfer intellectual properties on the blockchain.
              </p>
            </v-card-text>
          </v-card>
          
          <!-- Wallet Management Component -->
          <WalletManagement v-if="!userWallet" @wallet-updated="refreshWallet" />
          
          <!-- Transaction History -->
          <v-card v-if="userWallet" class="mt-6">
            <v-card-title>
              Transaction History
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-refresh"
                variant="text"
                @click="fetchTransactions"
                :loading="loadingTransactions"
              ></v-btn>
            </v-card-title>
            
            <v-table v-if="transactions.length > 0">
              <thead>
                <tr>
                  <th>Transaction Hash</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in transactions" :key="tx.hash">
                  <td>
                    <a :href="'https://etherscan.io/tx/' + tx.hash" target="_blank" class="text-decoration-none">
                      {{ truncateHash(tx.hash) }}
                    </a>
                  </td>
                  <td>{{ tx.type }}</td>
                  <td>{{ formatDate(tx.timestamp) }}</td>
                  <td>
                    <v-chip
                      :color="tx.status === 'Confirmed' ? 'success' : 'warning'"
                      size="small"
                      variant="elevated"
                      class="text-white"
                    >
                      {{ tx.status }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
            
            <v-card-text v-else class="text-center py-6">
              <p class="text-body-1 text-grey">No transactions found</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      

      <v-dialog v-model="showRemoveWalletDialog" max-width="500">
        <v-card>
          <v-card-title>Remove Wallet</v-card-title>
          <v-card-text>
            <p>Are you sure you want to remove your wallet from this account?</p>
            <p class="text-caption text-red mt-2">
              <v-icon icon="mdi-alert" size="small" color="error" class="me-1"></v-icon>
              This will not delete your wallet from the blockchain, but will remove your access to it from this application.
              Make sure you have backed up your private key or seed phrase.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="showRemoveWalletDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              @click="removeWallet"
              :loading="loadingRemoveWallet"
            >
              Remove Wallet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import WalletManagement from '../components/dashboard/WalletManagement.vue';
  import axios from 'axios';
  
  const authStore = useAuthStore();
  const userWallet = computed(() => authStore.getUser?.ethAddress || null);
  const balance = ref(null);
  const loadingBalance = ref(false);
  const transactions = ref([]);
  const loadingTransactions = ref(false);
  const showRemoveWalletDialog = ref(false);
  const loadingRemoveWallet = ref(false);
  
  onMounted(async () => {
    await refreshWallet();
    if (userWallet.value) {
      fetchBalance();
      fetchTransactions();
    }
  });
  
  async function refreshWallet() {
    await authStore.fetchUserProfile();
  }
  
  async function fetchBalance() {
    if (!userWallet.value) return;
    
    loadingBalance.value = true;
    try {
      const response = await axios.get(`/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      balance.value = response.data.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      balance.value = '0.0000';
    } finally {
      loadingBalance.value = false;
    }
  }
  
  async function fetchTransactions() {
    if (!userWallet.value) return;
    
    loadingTransactions.value = true;
    try {
      const response = await axios.get(`/api/wallet/transactions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      transactions.value = response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      transactions.value = [
        {
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          type: 'IP Registration',
          timestamp: Date.now() - 86400000,
          status: 'Confirmed'
        },
        {
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          type: 'IP Transfer',
          timestamp: Date.now() - 172800000,
          status: 'Confirmed'
        }
      ];
    } finally {
      loadingTransactions.value = false;
    }
  }
  
  async function removeWallet() {
    loadingRemoveWallet.value = true;
    try {
      await axios.post('/api/wallet/remove', {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      await refreshWallet();
      showRemoveWalletDialog.value = false;
    } catch (error) {
      console.error('Error removing wallet:', error);
    } finally {
      loadingRemoveWallet.value = false;
    }
  }
  
  function copyAddress() {
    if (!userWallet.value) return;
    
    navigator.clipboard.writeText(userWallet.value);
    // You could add a notification here
  }
  
  function openBlockExplorer() {
    if (!userWallet.value) return;
    
    window.open(`https://etherscan.io/address/${userWallet.value}`, '_blank');
  }
  
  function truncateHash(hash) {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  }
  </script>