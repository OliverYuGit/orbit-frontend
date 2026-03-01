<template>
  <div :class="['live-activity', { collapsed: isCollapsed }]">
    <!-- Collapsed State -->
    <template v-if="isCollapsed">
      <div class="collapsed-content">
        <div class="live-indicator-wrapper">
          <div class="live-indicator" />
        </div>
        <div class="collapsed-stat">{{ activities.length }}</div>
        <n-button text class="toggle-button" @click="isCollapsed = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </n-button>
      </div>
    </template>

    <!-- Expanded State -->
    <template v-else>
      <div class="activity-header">
        <div class="live-badge">
          <div class="live-indicator" />
          <span>Live Activity</span>
        </div>
        <n-button text class="toggle-button" @click="isCollapsed = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </n-button>
      </div>

      <div class="activity-list">
        <div v-if="activities.length === 0" class="no-activity">
          No recent activity
        </div>
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-dot"></div>
          <div class="activity-content">
            <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
            <div class="activity-text">{{ activity.message }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NButton } from 'naive-ui'
import { useTaskStore } from '@/stores/tasks'

interface Activity {
  id: number
  timestamp: Date
  message: string
}

const taskStore = useTaskStore()
const isCollapsed = ref(false)
const activities = ref<Activity[]>([])
let activityCheckInterval: ReturnType<typeof setInterval> | null = null

// Generate activity logs from task changes
function generateActivities(): Activity[] {
  const logs: Activity[] = []
  const tasks = taskStore.tasks
  
  // Sort tasks by updatedAt
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  
  // Take the most recent 10 tasks
  sortedTasks.slice(0, 10).forEach((task, index) => {
    const timestamp = new Date(task.updatedAt)
    let message = ''
    
    if (task.status === 'DONE') {
      message = `Task "${task.title}" completed`
    } else if (task.status === 'DOING') {
      message = `Task "${task.title}" moved to Doing`
    } else if (task.status === 'TODO') {
      message = `Task "${task.title}" moved to Todo`
    } else {
      message = `Task "${task.title}" created`
    }
    
    logs.push({
      id: task.id * 100 + index,
      timestamp,
      message
    })
  })
  
  return logs
}

function formatTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) {
    return 'just now'
  } else if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return timestamp.toLocaleDateString()
  }
}

function updateActivities() {
  activities.value = generateActivities()
}

onMounted(() => {
  updateActivities()
  // Update activities every 30 seconds
  activityCheckInterval = setInterval(updateActivities, 30000)
})

onUnmounted(() => {
  if (activityCheckInterval) {
    clearInterval(activityCheckInterval)
    activityCheckInterval = null
  }
})

// Watch for task store changes
taskStore.$subscribe(() => {
  updateActivities()
})
</script>

<style scoped>
.live-activity {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  width: 320px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.live-activity.collapsed {
  width: 60px;
  padding: 12px;
  gap: 16px;
}

.collapsed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.live-indicator-wrapper {
  display: flex;
  justify-content: center;
  padding: 4px 0;
}

.live-indicator {
  width: 8px;
  height: 8px;
  background: var(--accent-danger);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.toggle-button {
  color: var(--text-secondary);
  padding: 4px;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}

.activity-list::-webkit-scrollbar {
  width: 4px;
}

.activity-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.no-activity {
  font-size: 13px;
  color: var(--text-tertiary);
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ECDC4;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-time {
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  word-wrap: break-word;
}

.collapsed-stat {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .live-activity {
    display: none;
  }
}
</style>
