<template>
  <n-card
    :class="['task-card', { 'is-dragging': isDragging }]"
    size="small"
    hoverable
    draggable="true"
    :style="{ 
      cursor: isDragging ? 'grabbing' : 'grab',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      opacity: isDragging ? 0.5 : 1,
      transition: 'all 0.2s ease'
    }"
    @click="$emit('click')"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <n-ellipsis style="font-size: 14px; font-weight: 500; flex: 1; color: var(--text-primary);">
        {{ task.title }}
      </n-ellipsis>
      <n-tag 
        :type="priorityType" 
        size="small" 
        style="margin-left: 8px; flex-shrink: 0;"
        :bordered="false"
      >
        {{ task.priority }}
      </n-tag>
    </div>
    
    <div v-if="task.tags?.length" style="margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
      <n-tag 
        v-for="tag in task.tags.slice(0, 2)" 
        :key="tag" 
        size="small" 
        round
        :bordered="false"
        style="background: rgba(108, 99, 255, 0.2); color: #6C63FF;"
      >
        {{ tag }}
      </n-tag>
      <n-tag 
        v-if="task.tags.length > 2" 
        size="small" 
        round
        :bordered="false"
        style="background: rgba(108, 99, 255, 0.2); color: #6C63FF;"
      >
        +{{ task.tags.length - 2 }}
      </n-tag>
    </div>
    
    <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">
        {{ task.assignee?.displayName ?? task.assignee?.username ?? 'Unassigned' }}
      </span>
      <n-dropdown 
        :options="moveOptions" 
        @select="(s) => $emit('move', s as TaskStatus)" 
        trigger="click"
      >
        <n-button 
          size="tiny" 
          text 
          @click.stop
          style="color: rgba(255, 255, 255, 0.7);"
        >
          Move ▾
        </n-button>
      </n-dropdown>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NEllipsis, NTag, NButton, NDropdown } from 'naive-ui'
import type { Task, TaskStatus } from '@/types'

const props = defineProps<{ 
  task: Task;
  isDragging?: boolean;
}>()

const emit = defineEmits<{ 
  click: []; 
  move: [status: TaskStatus];
}>()

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'DOING', 'DONE']
const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog', TODO: 'Todo', DOING: 'Doing', DONE: 'Done'
}

const moveOptions = computed(() => 
  STATUSES
    .filter(s => s !== props.task.status)
    .map(s => ({ 
      label: `○ ${STATUS_LABELS[s]}`, 
      key: s,
      disabled: s === props.task.status
    }))
)

const priorityType = computed(() => ({
  P0: 'error', 
  P1: 'warning', 
  P2: 'default'
}[props.task.priority] as 'error' | 'warning' | 'default'))

const isDragging = ref(false)

function handleDragStart(e: DragEvent) {
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', props.task.id.toString())
  }
}

function handleDragEnd() {
  isDragging.value = false
}
</script>

<style scoped>
.task-card {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.2s ease,
              box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.1) !important;
}

.task-card.is-dragging {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

.task-card:active {
  cursor: grabbing;
}
</style>
