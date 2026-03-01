<template>
  <div class="login-page">
    <!-- Background Layer -->
    <div class="background-layer">
      <!-- Overlay -->
      <div class="overlay"></div>
      
      <!-- Glow Orbs -->
      <div class="glow-orb glow-1"></div>
      <div class="glow-orb glow-2"></div>
      <div class="glow-orb glow-3"></div>
      
      <!-- Geometric Decorations -->
      <div class="circle-decoration"></div>
      <div class="square-decoration"></div>
      
      <!-- Stars -->
      <div v-for="i in 25" :key="i" class="star" :style="getStarStyle(i)"></div>
    </div>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <!-- Left: Login Form -->
      <div class="login-form-container">
        <!-- Logo -->
        <div class="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" fill="url(#logo-gradient)" />
            <path d="M24 14L30 24L24 34L18 24L24 14Z" fill="white" opacity="0.9" />
            <defs>
              <linearGradient id="logo-gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stop-color="#667eea" />
                <stop offset="1" stop-color="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Title -->
        <h1 class="title">Welcome back</h1>
        <p class="subtitle">Sign in to continue to Orbit</p>

        <!-- Form -->
        <n-form ref="formRef" :model="form" :rules="rules" :show-label="false" @submit.prevent="handleLogin">
          <div class="input-group">
            <label class="input-label">Email</label>
            <n-form-item path="email">
              <input
                v-model="form.email"
                type="email"
                class="input-field"
                placeholder="you@orbit.local"
              />
            </n-form-item>
          </div>

          <div class="input-group">
            <label class="input-label">Password</label>
            <n-form-item path="password">
              <input
                v-model="form.password"
                type="password"
                class="input-field"
                placeholder="Enter your password"
              />
            </n-form-item>
          </div>

          <n-alert v-if="error" type="error" class="error-alert">
            {{ error }}
          </n-alert>

          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </n-form>


      </div>

      <!-- Right: Showcase -->
      <div class="showcase-container">
        <!-- Feature Card 1 -->
        <div class="feature-card">
          <div class="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">Mission Control</h3>
          <p class="card-description">
            Organize your tasks with powerful boards. Track progress from backlog to completion with intuitive drag-and-drop workflows.
          </p>
        </div>

        <!-- Feature Card 2 -->
        <div class="feature-card">
          <div class="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">Team Collaboration</h3>
          <p class="card-description">
            Work together seamlessly. Assign tasks, leave comments, and track activity in real-time with your entire team.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NAlert, type FormInst, type FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const error = ref('')
const form = ref({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
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
    
    await auth.login(form.value.email, form.value.password)
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

// Generate random star positions
function getStarStyle(index: number) {
  const positions = [
    { top: '10%', left: '15%', delay: '0s' },
    { top: '20%', left: '85%', delay: '0.5s' },
    { top: '15%', left: '45%', delay: '1s' },
    { top: '25%', left: '65%', delay: '1.5s' },
    { top: '35%', left: '25%', delay: '2s' },
    { top: '40%', left: '75%', delay: '2.5s' },
    { top: '45%', left: '50%', delay: '0.3s' },
    { top: '55%', left: '30%', delay: '0.8s' },
    { top: '60%', left: '80%', delay: '1.3s' },
    { top: '65%', left: '10%', delay: '1.8s' },
    { top: '70%', left: '60%', delay: '2.3s' },
    { top: '75%', left: '40%', delay: '0.6s' },
    { top: '80%', left: '70%', delay: '1.1s' },
    { top: '85%', left: '20%', delay: '1.6s' },
    { top: '90%', left: '90%', delay: '2.1s' },
    { top: '12%', left: '55%', delay: '0.4s' },
    { top: '28%', left: '35%', delay: '0.9s' },
    { top: '38%', left: '88%', delay: '1.4s' },
    { top: '48%', left: '18%', delay: '1.9s' },
    { top: '58%', left: '68%', delay: '2.4s' },
    { top: '68%', left: '48%', delay: '0.7s' },
    { top: '78%', left: '78%', delay: '1.2s' },
    { top: '88%', left: '38%', delay: '1.7s' },
    { top: '18%', left: '28%', delay: '2.2s' },
    { top: '32%', left: '92%', delay: '0.2s' }
  ]
  
  const pos = positions[index - 1] || positions[0] || { top: '50%', left: '50%', delay: '0s' }
  return {
    top: pos.top,
    left: pos.left,
    animationDelay: pos.delay
  }
}
</script>

<style scoped>
/* Main Container */
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #2D3561 0%, #1A1F3A 100%);
}

/* Background Layer */
.background-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

/* Glow Orbs */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.glow-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 70%);
}

.glow-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -150px;
  background: radial-gradient(circle, rgba(65, 105, 225, 0.25) 0%, transparent 70%);
  animation-delay: -3s;
}

.glow-3 {
  width: 350px;
  height: 350px;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  background: radial-gradient(circle, rgba(255, 105, 180, 0.2) 0%, transparent 70%);
  animation-delay: -6s;
}

/* Geometric Decorations */
.circle-decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  top: 15%;
  right: 10%;
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

.square-decoration {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.06);
  transform: rotate(45deg);
  bottom: 20%;
  left: 15%;
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

/* Stars */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
  pointer-events: none;
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 80px;
  max-width: 1200px;
  width: 100%;
  padding: 40px;
}

/* Login Form Container */
.login-form-container {
  width: 480px;
  padding: 60px 50px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Logo */
.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 32px;
}

/* Title */
.title {
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px 0;
}

/* Input Group */
.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: rgba(138, 43, 226, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(138, 43, 226, 0.1);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Error Alert */
.error-alert {
  margin-bottom: 24px;
  border-radius: 12px;
}

/* Login Button */
.login-button {
  width: 100%;
  height: 52px;
  margin-top: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  font-family: inherit;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Footer Links */
.footer-links {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-links a {
  color: rgba(138, 43, 226, 0.9);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #FFFFFF;
}

/* Showcase Container */
.showcase-container {
  width: 640px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 60px 0;
}

/* Feature Card */
.feature-card {
  height: 280px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

/* Card Content */
.card-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.card-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
    padding: 40px 20px;
    gap: 40px;
  }
  
  .login-form-container,
  .showcase-container {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }
  
  .feature-card {
    height: auto;
    min-height: 240px;
  }

  .circle-decoration,
  .square-decoration {
    display: none;
  }
}

@media (max-width: 640px) {
  .login-form-container {
    padding: 40px 30px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }

  .feature-card {
    padding: 30px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 14px;
  }
}

/* Override Naive UI form item styles */
:deep(.n-form-item) {
  margin-bottom: 0;
}

:deep(.n-form-item-blank) {
  min-height: auto;
}

:deep(.n-form-item-feedback-wrapper) {
  min-height: 24px;
  padding-top: 4px;
}

:deep(.n-form-item-feedback__line) {
  color: rgba(255, 100, 100, 0.9);
  font-size: 13px;
}
</style>
