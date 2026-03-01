<template>
  <n-card 
    :class="['board-column', { 'drag-over': isDragOver }]"
    :style="{ 
      width: '300px', 
      minWidth: '300px', 
      flexShrink: 0,
      background: columnBgColor,
      borderRadius: '16px',
      border: `2px solid ${columnBorderColor}`
    }"
    @drop="handleDrop"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
  >
    <template #header>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span :style="{ 
          display: 'inline-block', 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: statusColor 
        }"></span>
        <span :style="{ color: statusTextColor, fontWeight: 600 }">{{ STATUS_LABELS[status] }}</span>
      </div>
    </template>
    <template #header-extra>
      <n-tag size="small" :bordered="false" :style="{ background: statusColor, color: '#fff' }">
        {{ tasks.length }}
      </n-tag>
    </template>
    <n-scrollbar style="max-height: calc(100vh - 260px);">
      <div 
        style="display: flex; flex-direction: column; gap: 16px; padding: 16px; min-height: 100px;"
      >
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @click="$emit('click-task', task.id)"
          @move="(newStatus) => $emit('move', task.id, newStatus)"
        />
      </div>
    </n-scrollbar>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NTag, NScrollbar } from 'naive-ui'
import TaskCard from '@/components/task/TaskCard.vue'
import type { Task, TaskStatus } from '@/types'

const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog', TODO: 'Todo', DOING: 'Doing', DONE: 'Done'
}

const STATUS_COLORS: Record<TaskStatus, { bg: string; dot: string; text: string; border: string }> = {
  BACKLOG: { bg: 'rgba(201, 205, 212, 0.1)', dot: '#C9CDD4', text: '#C9CDD4', border: 'rgba(201, 205, 212, 0.3)' },
  TODO: { bg: 'rgba(255, 154, 46, 0.1)', dot: '#FF9A2E', text: '#FF9A2E', border: 'rgba(255, 154, 46, 0.3)' },
  DOING: { bg: 'rgba(47, 111, 237, 0.1)', dot: '#2F6FED', text: '#2F6FED', border: 'rgba(47, 111, 237, 0.3)' },
  DONE: { bg: 'rgba(0, 180, 42, 0.1)', dot: '#00B42A', text: '#00B42A', border: 'rgba(0, 180, 42, 0.3)' }
}

const props = defineProps<{ status: TaskStatus; tasks: Task[] }>()
const emit = defineEmits<{ 
  'click-task': [id: number]; 
  move: [taskId: number, status: TaskStatus];
}>()

const isDragOver = ref(false)

const columnBgColor = computed(() => STATUS_COLORS[props.status].bg)
const columnBorderColor = computed(() => STATUS_COLORS[props.status].border)
const statusColor = computed(() => STATUS_COLORS[props.status].dot)
const statusTextColor = computed(() => STATUS_COLORS[props.status].text)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  
  const taskId = e.dataTransfer?.getData('taskId')
  if (taskId) {
    emit('move', parseInt(taskId), props.status)
  }
}
</script>

<style scoped>
.board-column {
  transition: all 0.2s ease;
}

.board-column.drag-over {
  border: 2px dashed #2F6FED;
  filter: brightness(0.92);
}
</style>
