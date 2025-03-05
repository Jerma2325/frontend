import { defineStore } from 'pinia'
import axios from 'axios'
import apiClient from '../plugins/axios'

export const useIPStore = defineStore('ip', {
  state: () => ({
    intellectualProperties: [],
    currentIP: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getIPs: (state) => state.intellectualProperties,
    getCurrentIP: (state) => state.currentIP,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  actions: {
    async fetchAllIPs() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log("Fetching all IPs...");
        const response = await apiClient.get('/api/intellectual-properties');
        console.log("Fetched IPs:", response.data);
        this.intellectualProperties = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching IPs:', error);
        this.error = error.response?.data?.message || 'Failed to fetch intellectual properties';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchIPById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Fetching IP with ID: ${id}`);
        const response = await apiClient.get(`/api/intellectual-properties/${id}`);
        console.log("Fetched IP details:", response.data);
        this.currentIP = response.data;
        return response.data;
      } catch (error) {
        console.error(`Error fetching IP with ID ${id}:`, error);
        this.error = error.response?.data?.message || 'Failed to fetch intellectual property';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async registerIP(formData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log("Registering new IP...");
        
        console.log("FormData keys:", [...formData.keys()]);
        for (let [key, value] of formData.entries()) {
          if (key === 'file') {
            console.log("File information:", {
              name: value.name,
              type: value.type,
              size: value.size
            });
          } else {
            console.log(`FormData ${key}:`, value);
          }
        }

        const response = await axios({
          method: 'post',
          url: '/api/intellectual-properties',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log("IP registered successfully:", response.data);
        this.intellectualProperties.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Error registering IP:', error);
        this.error = error.response?.data?.message || error.message || 'Failed to register intellectual property';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async transferIP(id, transferData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Transferring IP ${id} to ${transferData.newOwnerAddress}...`);
        const response = await apiClient.post(`/api/intellectual-properties/${id}/transfer`, transferData);
        
        console.log("Transfer successful:", response.data);
        const index = this.intellectualProperties.findIndex(ip => ip.id === id);
        if (index !== -1) {
          this.intellectualProperties[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error(`Error transferring IP ${id}:`, error);
        this.error = error.response?.data?.message || 'Failed to transfer intellectual property';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
})