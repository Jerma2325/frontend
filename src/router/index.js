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
      component: LoginView,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
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
  const isAuthenticated = authStore.isAuthenticated

  console.log('Route navigation:', { 
    to: to.name, 
    requiresAuth: to.meta.requiresAuth,
    guestOnly: to.meta.guestOnly,
    isAuthenticated: isAuthenticated 
  })
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Authentication required, redirecting to login')
    next('/login')
    return
  }
  
  // Check if the route is guest-only (login/register) and user is already authenticated
  if (to.meta.guestOnly && isAuthenticated) {
    console.log('User already authenticated, redirecting to dashboard')
    next('/dashboard')
    return
  }
  
  // Proceed with navigation
  next()
})


export default router