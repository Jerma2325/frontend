// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterIPView from '../views/RegisterIPView.vue'
import TransferIPView from '../views/TransferIPView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      
    },
    {
      path: '/register-ip',
      name: 'register-ip',
      component: RegisterIPView,
      meta: { requiresAuth: true }
    },
    {
      path: '/transfer-ip/:id',
      name: 'transfer-ip',
      component: TransferIPView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  console.log('Route navigation:', { 
    to: to.name, 
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated 
  })
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Authentication required, redirecting to login')
    next('/login')
  } else {
    next()
  }
})

export default router