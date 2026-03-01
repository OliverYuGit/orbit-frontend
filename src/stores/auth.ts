import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  const isLoggedIn = () => !!token.value

  async function login(username: string, password: string) {
    const res = await authApi.login(username, password)
    token.value = res.data.data.accessToken
    user.value = res.data.data.user
    localStorage.setItem('token', res.data.data.accessToken)
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await authApi.me()
      user.value = res.data.data
    } catch {
      // token invalid, will be caught by 401 interceptor
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, login, logout, fetchMe }
})
