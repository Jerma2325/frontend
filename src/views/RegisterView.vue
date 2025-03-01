<template>
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="10" class="rounded-lg">
            <v-card-title class="text-center text-h5 pt-6 pb-2">
              Register
            </v-card-title>
            
            <RegisterForm />
            
            <v-card-text class="text-center pb-4">
              <p class="text-body-2">
                Already have an account?
                <v-btn
                  variant="text"
                  color="primary"
                  :to="{ name: 'login' }"
                  class="ps-1 pe-1"
                >
                  Login
                </v-btn>
              </p>
              
              <p class="text-body-2 mt-3">
                <v-btn
                  variant="text"
                  color="secondary"
                  :to="{ name: 'home' }"
                  class="ps-1 pe-1"
                >
                  Home
                </v-btn>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import RegisterForm from '../components/auth/RegisterForm.vue'
  </script>