<template>
  <div class="login-container">
    <!-- Left Panel: Login Form -->
    <div class="login-panel">
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

    <!-- Right Panel: Brand Showcase -->
    <div class="showcase-panel">
      <div class="showcase-content">
        <!-- Central starburst effect -->
        <div class="starburst-container">
          <div class="starburst"></div>
          <div class="starburst-glow"></div>
        </div>

        <!-- Floating orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <!-- Light rays -->
        <div class="light-ray ray-1"></div>
        <div class="light-ray ray-2"></div>
        <div class="light-ray ray-3"></div>
        <div class="light-ray ray-4"></div>

        <!-- Brand text -->
        <div class="brand-text">
          <h2 class="brand-title">Welcome to Orbit</h2>
          <p class="brand-description">
            Your mission control center for seamless operations and real-time insights.
          </p>
        </div>

        <!-- Decorative particles -->
        <div class="particles">
          <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
        </div>
      </div>
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

// Generate random particle positions
function getParticleStyle(index: number) {
  const angle = (index / 20) * 360
  const distance = 150 + Math.random() * 100
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance
  const delay = Math.random() * 3
  const duration = 2 + Math.random() * 2
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #2D3561 0%, #1A1F3A 100%);
  position: relative;
  overflow: hidden;
}

/* Left Panel - Login Form */
.login-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 2;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 56px 48px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.logo {
  font-size: 42px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.3px;
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
  margin-top: 12px;
  border-radius: 14px;
  font-weight: 600;
  height: 52px;
  font-size: 16px;
  letter-spacing: 0.3px;
}

/* Right Panel - Showcase */
.showcase-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.showcase-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Starburst Effect */
.starburst-container {
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.starburst {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(0deg, transparent 48%, rgba(99, 179, 237, 0.8) 50%, transparent 52%),
    linear-gradient(45deg, transparent 48%, rgba(99, 179, 237, 0.6) 50%, transparent 52%),
    linear-gradient(90deg, transparent 48%, rgba(99, 179, 237, 0.8) 50%, transparent 52%),
    linear-gradient(135deg, transparent 48%, rgba(99, 179, 237, 0.6) 50%, transparent 52%);
  animation: rotate 20s linear infinite;
}

.starburst-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(99, 179, 237, 0.6) 0%, rgba(99, 179, 237, 0.3) 30%, transparent 70%);
  filter: blur(40px);
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* Floating Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(99, 179, 237, 0.8), rgba(59, 130, 246, 0.4));
  box-shadow: 
    0 0 60px rgba(99, 179, 237, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  animation: float-orb 8s ease-in-out infinite;
}

.orb-1 {
  width: 120px;
  height: 120px;
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 25%;
  animation-delay: 2s;
  background: radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.8), rgba(99, 102, 241, 0.4));
  box-shadow: 
    0 0 50px rgba(147, 51, 234, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
}

.orb-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-30px) translateX(20px);
  }
  50% {
    transform: translateY(-10px) translateX(-20px);
  }
  75% {
    transform: translateY(-40px) translateX(10px);
  }
}

/* Light Rays */
.light-ray {
  position: absolute;
  width: 2px;
  height: 200px;
  background: linear-gradient(to bottom, transparent, rgba(99, 179, 237, 0.6), transparent);
  top: 50%;
  left: 50%;
  transform-origin: top center;
  opacity: 0.4;
  animation: ray-rotate 15s linear infinite;
}

.ray-1 {
  transform: translate(-50%, -50%) rotate(0deg);
  animation-delay: 0s;
}

.ray-2 {
  transform: translate(-50%, -50%) rotate(45deg);
  animation-delay: 1s;
}

.ray-3 {
  transform: translate(-50%, -50%) rotate(90deg);
  animation-delay: 2s;
}

.ray-4 {
  transform: translate(-50%, -50%) rotate(135deg);
  animation-delay: 3s;
}

@keyframes ray-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Brand Text */
.brand-text {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 500px;
  padding: 0 40px;
}

.brand-title {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 24px 0;
  letter-spacing: -1px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.brand-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(99, 179, 237, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(99, 179, 237, 0.8);
  animation: particle-float 3s ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Naive UI Overrides */
:deep(.n-input) {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s ease;
}

:deep(.n-input:hover) {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.n-input.n-input--focus) {
  background: rgba(255, 255, 255, 0.1);
  border-color: #63B3ED;
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.15);
}

:deep(.n-input__input) {
  color: #FFFFFF;
}

:deep(.n-input__input::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.n-button--primary-type) {
  background: linear-gradient(135deg, #63B3ED 0%, #4299E1 100%);
  border: none;
}

:deep(.n-button--primary-type:hover) {
  background: linear-gradient(135deg, #4299E1 0%, #3182CE 100%);
}

:deep(.n-button--primary-type:active) {
  background: linear-gradient(135deg, #3182CE 0%, #2C5282 100%);
}

:deep(.n-form-item) {
  margin-bottom: 24px;
}

:deep(.n-form-item-feedback-wrapper) {
  color: rgba(255, 255, 255, 0.7);
}

/* Mobile Responsive */
@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .login-panel {
    order: 2;
    padding: 32px 20px;
  }

  .showcase-panel {
    order: 1;
    min-height: 300px;
    flex: 0 0 300px;
  }

  .login-card {
    padding: 40px 32px;
    max-width: 100%;
  }

  .logo {
    font-size: 36px;
  }

  .subtitle {
    font-size: 14px;
  }

  .brand-title {
    font-size: 36px;
  }

  .brand-description {
    font-size: 16px;
  }

  .starburst-container {
    width: 300px;
    height: 300px;
  }

  .orb {
    display: none;
  }

  .light-ray {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .showcase-panel {
    min-height: 250px;
    flex: 0 0 250px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .logo {
    font-size: 32px;
  }

  .brand-title {
    font-size: 28px;
  }

  .brand-description {
    font-size: 14px;
  }

  .starburst-container {
    width: 200px;
    height: 200px;
  }
}
</style>
