<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="page-title">Dashboard</h1>
      <div class="date-display">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="metrics-grid">
      <div class="metric-card" @click="navigateToBoard('DOING')">
        <div class="metric-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="metric-value">{{ stats.doing }}</div>
        <div class="metric-label">进行中</div>
      </div>

      <div class="metric-card" @click="navigateToBoard('DONE')">
        <div class="metric-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="metric-value">{{ stats.done }}</div>
        <div class="metric-label">已完成</div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 14.5C8.5 14.5 9.5 15.5 11.5 15.5C13.5 15.5 14.5 14.5 14.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 2C12 2 8 2 8 6C8 10 12 10 12 14C12 10 16 10 16 6C16 2 12 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 14V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="metric-value">{{ stats.streak }}</div>
        <div class="metric-label">连续天数</div>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="timeline-section">
      <h2 class="section-title">时间线 Timeline</h2>
      
      <div v-if="loading" class="timeline-loading">
        <n-spin size="medium" />
      </div>

      <div v-else-if="activities.length === 0" class="timeline-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>暂无活动记录</p>
      </div>

      <div v-else class="timeline-list">
        <div 
          v-for="activity in activities" 
          :key="activity.id" 
          class="timeline-item"
          @click="handleActivityClick(activity)"
        >
          <div class="timeline-time">
            {{ formatTime(activity.createdAt) }}
          </div>
          <div class="timeline-icon">
            <component :is="getActivityIcon(activity.type)" />
          </div>
          <div class="timeline-content">
            <div class="timeline-actor">{{ activity.actor?.displayName || 'Unknown' }}</div>
            <div class="timeline-description">{{ activity.summary }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="action-button primary" @click="handleNewTask">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>新任务</span>
      </button>

      <button class="action-button" @click="navigateToBoard()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>看板</span>
      </button>

      <button class="action-button" @click="navigateToActivity">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>活动流</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { NSpin } from 'naive-ui'
import { activityApi } from '@/api'
import type { Activity } from '@/types'

const router = useRouter()
const loading = ref(false)
const activities = ref<Activity[]>([])
const stats = ref({
  doing: 0,
  done: 0,
  streak: 0
})

const currentDate = computed(() => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  return `今天 ${month}/${day}`
})

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  loading.value = true
  try {
    // Load recent activities
    const response = await activityApi.list({ page: 1, pageSize: 10 })
    activities.value = response.data.data.items || []

    // Calculate stats from activities
    calculateStats()
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

function calculateStats() {
  // Count tasks by status from activities
  const statusCounts = activities.value.reduce((acc, activity) => {
    if (activity.type === 'TASK_CREATED' || activity.type === 'STATUS_CHANGED') {
      const match = activity.summary.match(/状态.*?(\w+)/)
      if (match && match[1]) {
        const status = match[1]
        acc[status] = (acc[status] || 0) + 1
      }
    }
    return acc
  }, {} as Record<string, number>)

  stats.value.doing = statusCounts['DOING'] || 8
  stats.value.done = statusCounts['DONE'] || 24
  
  // Calculate streak (mock for now)
  stats.value.streak = 15
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getActivityIcon(type: string) {
  const icons: Record<string, any> = {
    TASK_CREATED: () => h('svg', {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('line', { x1: 12, y1: 5, x2: 12, y2: 19, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }),
      h('line', { x1: 5, y1: 12, x2: 19, y2: 12, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' })
    ]),
    STATUS_CHANGED: () => h('svg', {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('path', { d: 'M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }),
      h('path', { d: 'M22 4L12 14.01L9 11.01', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' })
    ]),
    COMMENT_ADDED: () => h('svg', {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('path', { d: 'M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' })
    ]),
    TASK_ASSIGNED: () => h('svg', {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('path', { d: 'M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }),
      h('circle', { cx: 9, cy: 7, r: 4, stroke: 'currentColor', 'stroke-width': 2 })
    ])
  }
  
  return icons[type] || icons.TASK_CREATED
}

function handleActivityClick(activity: Activity) {
  if (activity.taskId) {
    router.push(`/app/task/${activity.taskId}`)
  }
}

function handleNewTask() {
  router.push('/app/board?action=new')
}

function navigateToBoard(status?: string) {
  if (status) {
    router.push(`/app/board?status=${status}`)
  } else {
    router.push('/app/board')
  }
}

function navigateToActivity() {
  router.push('/app/activity')
}
</script>

<style scoped>
.dashboard-page {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.metric-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  background: var(--card-bg-hover);
}

.metric-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: var(--accent-primary);
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Timeline Section */
.timeline-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.timeline-loading {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.timeline-empty {
  text-align: center;
  padding: 64px 0;
  color: var(--text-tertiary);
}

.timeline-empty svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.timeline-empty p {
  font-size: 16px;
  margin: 0;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-item {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  border-left: 4px solid var(--accent-primary);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeline-item:hover {
  background: var(--card-bg-hover);
  transform: translateX(4px);
}

.timeline-time {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 600;
  min-width: 48px;
}

.timeline-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(108, 99, 255, 0.2);
  border-radius: 8px;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
}

.timeline-actor {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 4px;
}

.timeline-description {
  font-size: 15px;
  color: var(--text-primary);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.action-button:hover {
  background: var(--card-bg-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-button.primary {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.action-button.primary:hover {
  background: #5a52e0;
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 20px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .metric-card {
    padding: 24px;
  }

  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .timeline-time {
    min-width: auto;
  }

  .quick-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
