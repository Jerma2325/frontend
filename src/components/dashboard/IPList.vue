<template>
    <div>
      <v-row>
        <v-col
          v-for="ip in intellectualProperties"
          :key="ip.id"
          cols="12"
          sm="6"
          md="4"
        >
          <IPItem :intellectual-property="ip" />
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import IPItem from './IPItem.vue'
  
  const props = defineProps({
    intellectualProperties: {
      type: Array,
      required: true
    }
  })
  </script>