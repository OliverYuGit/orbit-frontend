<template>
  <div class="login-container">
    <!-- Left Panel: Login Form -->
    <div class="login-panel">
      <div class="login-form">
        <div class="form-header">
          <h1 class="welcome-title">Welcome back</h1>
          <p class="welcome-subtitle">Please Enter your Account details</p>
        </div>

        <n-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleLogin">
          <n-form-item path="email" :show-label="false">
            <n-input
              v-model:value="form.email"
              placeholder="Email"
              size="large"
              type="email"
              :input-props="{ autocomplete: 'email' }"
              class="dark-input"
            />
          </n-form-item>

          <n-form-item path="password" :show-label="false">
            <n-input
              v-model:value="form.password"
              type="password"
              placeholder="Password"
              size="large"
              show-password-on="click"
              :input-props="{ autocomplete: 'current-password' }"
              class="dark-input"
            />
          </n-form-item>

          <div class="form-options">
            <n-checkbox v-model:checked="form.keepLoggedIn" class="keep-logged-in">
              Keep me logged in
            </n-checkbox>
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
              Forgot Password
            </a>
          </div>

          <n-alert v-if="error" type="error" class="error-alert">
            {{ error }}
          </n-alert>

          <n-button
            type="primary"
            size="large"
            block
            attr-type="submit"
            :loading="loading"
            class="signin-button"
          >
            Sign in
          </n-button>
        </n-form>
      </div>
    </div>

    <!-- Right Panel: Showcase -->
    <div class="showcase-panel">
      <div class="showcase-content">
        <!-- Starburst effect -->
        <div class="starburst-container">
          <div class="starburst"></div>
          <div class="starburst-glow"></div>
        </div>

        <!-- Testimonial Card -->
        <div class="testimonial-card">
          <h3 class="testimonial-title">What's our Jobseekers Said</h3>
          <div class="testimonial-content">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star">★</span>
            </div>
            <p class="testimonial-text">
              "This platform completely transformed my job search experience. 
              The interface is intuitive and the opportunities are exactly what I was looking for."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="https://i.pravatar.cc/150?img=12" alt="User" />
              </div>
              <div class="author-info">
                <div class="author-name">Sarah Johnson</div>
                <div class="author-role">Software Engineer</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Info Card -->
        <div class="info-card">
          <div class="info-content">
            <h4 class="info-title">Get your right job with Orbit</h4>
            <p class="info-description">
              Join thousands of professionals who found their dream careers through our platform
            </p>
          </div>
          <div class="info-avatars">
            <div class="avatar-stack">
              <img src="https://i.pravatar.cc/150?img=1" alt="User 1" />
              <img src="https://i.pravatar.cc/150?img=2" alt="User 2" />
              <img src="https://i.pravatar.cc/150?img=3" alt="User 3" />
              <img src="https://i.pravatar.cc/150?img=4" alt="User 4" />
            </div>
            <span class="avatar-count">+2.5k users</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NAlert, NCheckbox, type FormInst, type FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const error = ref('')
const form = ref({
  email: '',
  password: '',
  keepLoggedIn: false
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
    
    // Use email as username for now
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

function handleForgotPassword() {
  // TODO: Implement forgot password flow
  console.log('Forgot password clicked')
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
  padding: 60px;
  position: relative;
  z-index: 2;
}

.login-form {
  width: 100%;
  max-width: 460px;
}

.form-header {
  margin-bottom: 48px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
}

.welcome-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 400;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.keep-logged-in {
  color: rgba(255, 255, 255, 0.8);
}

.forgot-password {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #FFFFFF;
}

.error-alert {
  margin-bottom: 24px;
  border-radius: 12px;
}

.signin-button {
  height: 56px;
  border-radius: 16px;
  font-weight: 600;
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
  padding: 60px;
}

.showcase-content {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

/* Starburst Effect */
.starburst-container {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.starburst {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(0deg, transparent 49%, rgba(139, 92, 246, 0.4) 50%, transparent 51%),
    linear-gradient(30deg, transparent 49%, rgba(99, 102, 241, 0.3) 50%, transparent 51%),
    linear-gradient(60deg, transparent 49%, rgba(139, 92, 246, 0.4) 50%, transparent 51%),
    linear-gradient(90deg, transparent 49%, rgba(99, 102, 241, 0.3) 50%, transparent 51%),
    linear-gradient(120deg, transparent 49%, rgba(139, 92, 246, 0.4) 50%, transparent 51%),
    linear-gradient(150deg, transparent 49%, rgba(99, 102, 241, 0.3) 50%, transparent 51%);
  animation: rotate-starburst 30s linear infinite;
}

.starburst-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(99, 102, 241, 0.3) 30%, transparent 70%);
  filter: blur(60px);
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes rotate-starburst {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Testimonial Card */
.testimonial-card {
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.testimonial-title {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 24px 0;
}

.testimonial-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #FCD34D;
  font-size: 20px;
}

.testimonial-text {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
}

.author-role {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

/* Info Card */
.info-card {
  position: relative;
  z-index: 2;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A1F3A;
  margin: 0 0 8px 0;
}

.info-description {
  font-size: 14px;
  color: rgba(26, 31, 58, 0.7);
  margin: 0;
  line-height: 1.5;
}

.info-avatars {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.avatar-stack {
  display: flex;
  margin-right: -8px;
}

.avatar-stack img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #FFFFFF;
  margin-right: -12px;
  object-fit: cover;
}

.avatar-count {
  font-size: 13px;
  font-weight: 600;
  color: rgba(26, 31, 58, 0.7);
}

/* Naive UI Overrides */
:deep(.n-input.dark-input) {
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

:deep(.n-input.dark-input:hover) {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.15);
}

:deep(.n-input.dark-input.n-input--focus) {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

:deep(.n-input__input) {
  color: #FFFFFF;
  font-size: 15px;
}

:deep(.n-input__input::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.n-button--primary-type) {
  background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%);
  border: none;
}

:deep(.n-button--primary-type:hover) {
  background: linear-gradient(135deg, #DB2777 0%, #BE185D 100%);
}

:deep(.n-button--primary-type:active) {
  background: linear-gradient(135deg, #BE185D 0%, #9F1239 100%);
}

:deep(.n-form-item) {
  margin-bottom: 24px;
}

:deep(.n-checkbox) {
  --n-text-color: rgba(255, 255, 255, 0.8);
}

:deep(.n-checkbox:hover) {
  --n-text-color: #FFFFFF;
}

/* Mobile Responsive */
@media (max-width: 1200px) {
  .login-container {
    flex-direction: column;
  }

  .login-panel {
    order: 1;
    padding: 40px 32px;
  }

  .showcase-panel {
    order: 2;
    padding: 40px 32px;
    min-height: 600px;
  }

  .showcase-content {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .login-panel {
    padding: 32px 24px;
  }

  .showcase-panel {
    padding: 32px 24px;
    min-height: 500px;
  }

  .welcome-title {
    font-size: 36px;
  }

  .welcome-subtitle {
    font-size: 14px;
  }

  .testimonial-card {
    padding: 32px 24px;
  }

  .testimonial-title {
    font-size: 20px;
  }

  .info-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }

  .info-avatars {
    align-items: flex-start;
  }

  .starburst-container {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 480px) {
  .login-panel {
    padding: 24px 20px;
  }

  .showcase-panel {
    padding: 24px 20px;
    min-height: 450px;
  }

  .welcome-title {
    font-size: 32px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .testimonial-card {
    padding: 24px 20px;
  }

  .info-card {
    padding: 20px;
  }

  .starburst-container {
    width: 250px;
    height: 250px;
  }
}
</style>
