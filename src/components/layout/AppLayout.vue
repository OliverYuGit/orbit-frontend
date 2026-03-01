<template>
  <n-config-provider :theme="null">
    <n-layout style="height: 100vh">
      <n-layout-header bordered style="height: 56px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 18px; font-weight: 600; color: #2F6FED;">Orbit</span>
        <n-input placeholder="Search tasks..." style="width: 240px;" />
        <n-dropdown :options="userMenuOptions" @select="handleUserMenu">
          <n-button text>{{ auth.user?.username ?? 'User' }}</n-button>
        </n-dropdown>
      </n-layout-header>
      <n-layout has-sider style="height: calc(100vh - 56px)">
        <n-layout-sider bordered width="220" content-style="padding: 16px 0;">
          <n-menu :options="menuOptions" :value="activeKey" @update:value="handleNav" />
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px; background: #F7F8FA; overflow: auto;">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu, NInput, NButton, NDropdown } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const activeKey = computed(() => route.path.split('/')[2] ?? 'board')

const menuOptions = [
  { label: 'Mission Board', key: 'board' },
  { label: 'Activity', key: 'activity' },
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
</script>
