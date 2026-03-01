<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <n-layout class="app-layout">
        <n-layout-header class="app-header">
          <div class="header-left">
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
            <span class="app-name">Orbit</span>
          </div>
          <n-dropdown :options="userMenuOptions" @select="handleUserMenu">
            <n-button text class="user-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ auth.user?.displayName ?? auth.user?.username ?? 'User' }}</span>
            </n-button>
          </n-dropdown>
        </n-layout-header>
        <n-layout has-sider class="app-body">
          <n-layout-sider class="app-sider" :width="240">
            <n-menu 
              :options="menuOptions" 
              :value="activeKey" 
              @update:value="handleNav"
              :indent="20"
            />
          </n-layout-sider>
          <n-layout-content class="app-content">
            <router-view />
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NConfigProvider, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
  NMenu, NButton, NDropdown, NMessageProvider, darkTheme
} from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const activeKey = computed(() => route.path.split('/')[2] ?? 'dashboard')

const menuOptions = [
  { 
    label: 'Dashboard', 
    key: 'dashboard',
    icon: () => h('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('path', { d: 'M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M9 22V12H15V22', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  { 
    label: 'Mission Board', 
    key: 'board',
    icon: () => h('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('rect', { x: 3, y: 3, width: 7, height: 7, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('rect', { x: 14, y: 3, width: 7, height: 7, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('rect', { x: 14, y: 14, width: 7, height: 7, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('rect', { x: 3, y: 14, width: 7, height: 7, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  { 
    label: 'Activity', 
    key: 'activity',
    icon: () => h('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('circle', { cx: 12, cy: 12, r: 10, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M12 6V12L16 14', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
]

const userMenuOptions = [
  { label: 'Logout', key: 'logout' },
]

function handleNav(key: string) {
  router.push(`/app/${key}`)
}

function handleUserMenu(key: string) {
  if (key === 'logout') {
    auth.logout()
    router.push('/login')
  }
}

onMounted(() => {
  if (!auth.user) auth.fetchMe()
})
</script>

<style scoped>
.app-layout {
  height: 100vh;
  background: var(--bg-gradient);
}

.app-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
}

.app-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.app-body {
  height: calc(100vh - 64px);
}

.app-sider {
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 0;
}

.app-content {
  background: transparent;
  overflow: auto;
}

/* Override Naive UI Menu styles */
:deep(.n-menu) {
  background: transparent;
  color: var(--text-primary);
}

:deep(.n-menu-item) {
  margin: 4px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
}

:deep(.n-menu-item:hover) {
  background: var(--card-bg-hover);
  color: var(--text-primary);
}

:deep(.n-menu-item.n-menu-item--selected) {
  background: var(--accent-primary);
  color: var(--text-primary);
  font-weight: 600;
}

:deep(.n-menu-item-content) {
  padding: 12px 16px;
}

:deep(.n-menu-item-content__icon) {
  color: inherit;
}

/* Override Naive UI Dropdown styles */
:deep(.n-dropdown-menu) {
  background: rgba(42, 48, 82, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.n-dropdown-option) {
  color: var(--text-primary);
}

:deep(.n-dropdown-option:hover) {
  background: var(--card-bg-hover);
}
</style>
