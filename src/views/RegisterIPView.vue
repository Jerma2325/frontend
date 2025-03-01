<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" lg="6" class="mx-auto">
          <v-card elevation="3">
            <v-card-title class="text-h5 py-4 px-6">
              Register New IP
            </v-card-title>
            
            <v-divider></v-divider>
            
            <RegisterIPForm />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import RegisterIPForm from '../components/dashboard/RegisterIPForm.vue'
  </script>