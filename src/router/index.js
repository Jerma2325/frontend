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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)

  console.log('Route navigation:', { 
    from: from.name,
    to: to.name, 
    requiresAuth,
    isGuestRoute,
    isAuthenticated
  })
  
  // Validate token by fetching user profile if authenticated but no user data
  if (isAuthenticated && !authStore.getUser) {
    console.log('Token exists but no user data, fetching profile...')
    try {
      await authStore.fetchUserProfile()
    } catch (error) {
      console.error('Failed to fetch user profile, clearing authentication')
      authStore.logout()
    }
  }
  
  // Handle authentication requirements
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('Authentication required, redirecting to login')
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Redirect logged in users away from login/register pages
  else if (isAuthenticated && isGuestRoute) {
    console.log('User is already authenticated, redirecting to dashboard')
    next({ name: 'dashboard' })
  }
  else {
    next()
  }
})

export default router