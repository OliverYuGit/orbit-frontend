import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/app/board' },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/app',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: 'board', component: () => import('@/views/BoardView.vue') },
        { path: 'task/:id', component: () => import('@/views/TaskDetailView.vue') },
        { path: 'activity', component: () => import('@/views/ActivityView.vue') },
        { path: '', redirect: 'board' },
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
    return '/app/board'
  }
})

export default router
