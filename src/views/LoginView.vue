<template>
  <div class="login-container">
    <!-- Background decorative elements -->
    <div class="background-decoration">
      <!-- Stars -->
      <div class="stars"></div>
      <div class="stars-small"></div>
      
      <!-- Shooting stars -->
      <div class="shooting-star" style="top: 20%; left: 10%; animation-delay: 0s;"></div>
      <div class="shooting-star" style="top: 40%; left: 60%; animation-delay: 3s;"></div>
      <div class="shooting-star" style="top: 70%; left: 30%; animation-delay: 6s;"></div>
      
      <!-- Geometric shapes -->
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      
      <!-- Gradient glows -->
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      
      <!-- Floating lines -->
      <svg class="floating-lines" xmlns="http://www.w3.org/2000/svg">
        <line class="line line-1" x1="0" y1="0" x2="200" y2="200" />
        <line class="line line-2" x1="100%" y1="0" x2="80%" y2="100%" />
        <line class="line line-3" x1="50%" y1="100%" x2="50%" y2="0" />
      </svg>
    </div>

    <div class="login-card">
      <div class="login-header">
        <h1 class="logo">Orbit</h1>
        <p class="subtitle">Mission Control System</p>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleLogin">
        <n-form-item path="username" :show-label="false">
          <n-input
            v-model:value="form.username"
            placeholder="Username"
            size="large"
            :input-props="{ autocomplete: 'username' }"
          >
            <template #prefix>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" :show-label="false">
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="Password"
            size="large"
            show-password-on="click"
            :input-props="{ autocomplete: 'current-password' }"
          >
            <template #prefix>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </template>
          </n-input>
        </n-form-item>

        <n-alert v-if="error" type="error" class="error-alert">
          {{ error }}
        </n-alert>

        <n-button
          type="primary"
          size="large"
          block
          attr-type="submit"
          :loading="loading"
          class="login-button"
        >
          Login
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NAlert, type FormInst, type FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const error = ref('')
const form = ref({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' }
  ]
}

async function handleLogin() {
  error.value = ''
  
  try {
    await formRef.value?.validate()
    loading.value = true
    
    await auth.login(form.value.username, form.value.password)
    router.push('/app/board')
  } catch (err: any) {
    if (err?.message) {
      // Validation error
      return
    }
    error.value = 'Invalid credentials or network error.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2D3561 0%, #1A1F3A 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Background Decoration Layer */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* Stars */
.stars,
.stars-small {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 90% 60%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 33% 80%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(2px 2px at 15% 90%, rgba(255, 255, 255, 0.7), transparent);
  background-size: 200% 200%;
  animation: twinkle 8s ease-in-out infinite;
}

.stars-small {
  background-image: 
    radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 40% 40%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 70% 60%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 25% 75%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 85% 85%, rgba(255, 255, 255, 0.4), transparent);
  animation: twinkle 6s ease-in-out infinite reverse;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shooting Stars */
.shooting-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.8);
  animation: shoot 9s linear infinite;
  opacity: 0;
}

@keyframes shoot {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  20% {
    transform: translateX(200px) translateY(200px);
    opacity: 0;
  }
  100% {
    transform: translateX(200px) translateY(200px);
    opacity: 0;
  }
}

/* Geometric Circles */
.circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(108, 99, 255, 0.15);
  animation: float 20s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation-delay: 3s;
  border-color: rgba(147, 51, 234, 0.15);
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  animation-delay: 6s;
  border-color: rgba(59, 130, 246, 0.15);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

/* Gradient Glows */
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: pulse 8s ease-in-out infinite;
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6C63FF 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.glow-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #9333EA 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: 4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.1);
  }
}

/* Floating Lines */
.floating-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.line {
  stroke: rgba(108, 99, 255, 0.2);
  stroke-width: 1;
  fill: none;
  stroke-dasharray: 5, 10;
  animation: dash 20s linear infinite;
}

.line-1 {
  animation-delay: 0s;
}

.line-2 {
  animation-delay: 3s;
  stroke: rgba(147, 51, 234, 0.2);
}

.line-3 {
  animation-delay: 6s;
  stroke: rgba(59, 130, 246, 0.2);
}

@keyframes dash {
  to {
    stroke-dashoffset: -100;
  }
}

/* Login Card - ensure it's above background */
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.login-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
}

.input-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
}

.error-alert {
  margin-bottom: 20px;
  border-radius: 12px;
}

.login-button {
  margin-top: 8px;
  border-radius: 12px;
  font-weight: 600;
  height: 48px;
  font-size: 16px;
}

/* Naive UI overrides for dark theme */
:deep(.n-input) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

:deep(.n-input:hover) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.n-input.n-input--focus) {
  background: rgba(255, 255, 255, 0.1);
  border-color: #6C63FF;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

:deep(.n-input__input) {
  color: #FFFFFF;
}

:deep(.n-input__input::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.n-button--primary-type) {
  background: #6C63FF;
  border: none;
}

:deep(.n-button--primary-type:hover) {
  background: #5850E6;
}

:deep(.n-button--primary-type:active) {
  background: #4A42CC;
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-form-item-feedback-wrapper) {
  color: rgba(255, 255, 255, 0.7);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 36px 28px;
    max-width: 100%;
  }

  .logo {
    font-size: 32px;
  }

  .subtitle {
    font-size: 13px;
  }

  /* Reduce background effects on mobile for performance */
  .glow {
    display: none;
  }

  .circle {
    animation-duration: 30s;
  }
}
</style>
