<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F7F8FA;">
    <n-card style="width: 380px;" title="Orbit — Mission">
      <n-alert v-if="error" type="error" style="margin-bottom: 16px;">{{ error }}</n-alert>
      <n-form @submit.prevent="handleLogin">
        <n-form-item label="Username">
          <n-input v-model:value="form.username" placeholder="Enter username" />
        </n-form-item>
        <n-form-item label="Password">
          <n-input v-model:value="form.password" type="password" placeholder="Enter password" show-password-on="click" />
        </n-form-item>
        <n-button type="primary" block attr-type="submit" :loading="loading">Login</n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NAlert } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const error = ref('')
const form = ref({ username: '', password: '' })

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.username, form.value.password)
    router.push('/app/board')
  } catch {
    error.value = 'Invalid credentials or network error.'
  } finally {
    loading.value = false
  }
}
</script>
