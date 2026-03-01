import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/app/dashboard' },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/app',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: () => import('@/views/DashboardView.vue') },
        { path: 'board', component: () => import('@/views/BoardView.vue') },
        { path: 'task/:id', component: () => import('@/views/TaskDetailView.vue') },
        { path: 'activity', component: () => import('@/views/ActivityView.vue') },
        { path: '', redirect: 'dashboard' },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return '/login'
  }
  if (to.path === '/login' && auth.isLoggedIn()) {
    return '/app/dashboard'
  }
})

export default router
