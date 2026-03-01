<template>
  <div :class="['live-activity', { collapsed: isCollapsed }]">
    <!-- Collapsed State -->
    <template v-if="isCollapsed">
      <div class="collapsed-content">
        <div class="live-indicator-wrapper">
          <div class="live-indicator" />
        </div>
        <div class="collapsed-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <div class="collapsed-stat">{{ todayCompleted }}</div>
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
          <span>LIVE</span>
        </div>
        <n-button text class="toggle-button" @click="isCollapsed = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </n-button>
      </div>

      <div class="current-task">
        <div class="section-label">Current Task</div>
        <div v-if="currentTask" class="task-info">
          <div class="task-title">{{ currentTask.title }}</div>
          <div class="task-meta">
            <span class="priority-badge" :class="`priority-${currentTask.priority.toLowerCase()}`">
              {{ currentTask.priority }}
            </span>
          </div>
        </div>
        <div v-else class="no-task">
          No active task
        </div>
      </div>

      <div class="timer-section">
        <div class="timer-display">{{ formattedTime }}</div>
        <n-space justify="center" :size="12">
          <n-button 
            :type="isRunning ? 'warning' : 'primary'"
            @click="toggleTimer"
            style="border-radius: 8px;"
          >
            {{ isRunning ? 'Pause' : 'Start' }}
          </n-button>
          <n-button 
            @click="resetTimer"
            style="border-radius: 8px;"
          >
            Reset
          </n-button>
        </n-space>
      </div>

      <div class="stats-section">
        <div class="section-label">Today's Stats</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Completed</div>
            <div class="stat-value">{{ todayCompleted }}/{{ todayTotal }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Focus Time</div>
            <div class="stat-value">{{ focusTimeFormatted }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types'

const taskStore = useTaskStore()
const isCollapsed = ref(false)
const isRunning = ref(false)
const timeInSeconds = ref(25 * 60) // 25 minutes default
const focusTimeInSeconds = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

const currentTask = computed<Task | undefined>(() => {
  return taskStore.tasks.find(t => t.status === 'DOING')
})

const todayCompleted = computed(() => {
  const today = new Date().toDateString()
  return taskStore.tasks.filter(t => 
    t.status === 'DONE' && 
    new Date(t.updatedAt).toDateString() === today
  ).length
})

const todayTotal = computed(() => {
  return taskStore.tasks.length
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeInSeconds.value / 60)
  const seconds = timeInSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const focusTimeFormatted = computed(() => {
  const hours = Math.floor(focusTimeInSeconds.value / 3600)
  const minutes = Math.floor((focusTimeInSeconds.value % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  if (!currentTask.value) {
    return
  }
  isRunning.value = true
  timerInterval = setInterval(() => {
    if (timeInSeconds.value > 0) {
      timeInSeconds.value--
      focusTimeInSeconds.value++
    } else {
      pauseTimer()
      // Timer completed - could add notification here
    }
  }, 1000)
}

function pauseTimer() {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  pauseTimer()
  timeInSeconds.value = 25 * 60
}

onMounted(() => {
  // Load focus time from localStorage
  const savedFocusTime = localStorage.getItem('orbit-focus-time')
  if (savedFocusTime) {
    const data = JSON.parse(savedFocusTime)
    const today = new Date().toDateString()
    if (data.date === today) {
      focusTimeInSeconds.value = data.seconds
    }
  }
})

onUnmounted(() => {
  pauseTimer()
  // Save focus time to localStorage
  const today = new Date().toDateString()
  localStorage.setItem('orbit-focus-time', JSON.stringify({
    date: today,
    seconds: focusTimeInSeconds.value
  }))
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
  height: fit-content;
  position: sticky;
  top: 16px;
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

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.current-task {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}

.task-meta {
  display: flex;
  gap: 8px;
}

.priority-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.priority-badge.priority-p0 {
  background: rgba(255, 107, 157, 0.2);
  color: #FF6B9D;
}

.priority-badge.priority-p1 {
  background: rgba(255, 217, 61, 0.2);
  color: #FFD93D;
}

.priority-badge.priority-p2 {
  background: rgba(78, 205, 196, 0.2);
  color: #4ECDC4;
}

.no-task {
  font-size: 13px;
  color: var(--text-tertiary);
  font-style: italic;
}

.timer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.timer-display {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
}

.stats-section {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.collapsed-icon {
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
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
