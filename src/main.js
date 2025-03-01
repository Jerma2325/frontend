import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import apiClient from './plugins/axios'

import 'vuetify/styles'

const app = createApp(App)

const pinia = createPinia()

app.config.globalProperties.$axios = apiClient

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')