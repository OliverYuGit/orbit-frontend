<template>
  <div class="board-view">
    <n-page-header title="Mission Board" style="margin-bottom: 16px;">
      <template #extra>
        <n-button 
          type="primary" 
          @click="showCreate = true"
          style="background: #6C63FF; border: none;"
        >
          + New Task
        </n-button>
      </template>
    </n-page-header>

    <!-- Filter Bar -->
    <n-space 
      :class="['filter-bar', { 'filter-active': hasActiveFilters }]"
      style="margin: 16px 0; padding: 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.05);" 
      align="center" 
      wrap
    >
      <n-select
        v-model:value="filters.status"
        :options="statusOptions"
        placeholder="Status"
        clearable
        multiple
        style="width: 160px;"
      />
      <n-select
        v-model:value="filters.priority"
        :options="priorityOptions"
        placeholder="Priority"
        clearable
        multiple
        style="width: 140px;"
      />
      <n-select
        v-model:value="filters.assigneeId"
        :options="userOptions"
        placeholder="Assignee"
        clearable
        style="width: 150px;"
      />
      <n-input
        v-model:value="filters.q"
        placeholder="Search tasks..."
        clearable
        style="width: 200px;"
        @update:value="debouncedFetch"
      >
        <template #prefix>
          <span style="opacity: 0.5;">🔍</span>
        </template>
      </n-input>
      <n-button 
        @click="resetFilters"
        :type="hasActiveFilters ? 'warning' : 'default'"
        ghost
      >
        Reset
      </n-button>
    </n-space>

    <!-- Board Columns with DnD -->
    <DndContext
      :sensors="sensors"
      :collision-detection="closestCorners"
      @drag-start="handleDragStart"
      @drag-over="handleDragOver"
      @drag-end="handleDragEnd"
    >
      <div class="board-columns">
        <SortableContext
          v-for="status in STATUSES"
          :key="status"
          :items="tasksByStatus(status).map(t => `task-${t.id}`)"
          :strategy="verticalListSortingStrategy"
        >
          <BoardColumn
            :status="status"
            :tasks="tasksByStatus(status)"
            @move="handleMove"
            @click-task="openTask"
          />
        </SortableContext>
      </div>

      <!-- Drag Overlay -->
      <DragOverlay>
        <TaskCard
          v-if="activeTask"
          :task="activeTask"
          :is-dragging="true"
          style="cursor: grabbing; transform: rotate(2deg) scale(1.02);"
        />
      </DragOverlay>
    </DndContext>

    <!-- Create Task Modal -->
    <TaskCreateModal v-model:show="showCreate" @created="handleTaskCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { 
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { NPageHeader, NButton, NSpace, NSelect, NInput, useMessage } from 'naive-ui'
import { useTaskStore } from '@/stores/tasks'
import { userApi } from '@/api'
import BoardColumn from '@/components/board/BoardColumn.vue'
import TaskCard from '@/components/task/TaskCard.vue'
import TaskCreateModal from '@/components/task/TaskCreateModal.vue'
import type { TaskStatus, User, Task } from '@/types'

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'DOING', 'DONE']
const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog', TODO: 'Todo', DOING: 'Doing', DONE: 'Done'
}

const router = useRouter()
const taskStore = useTaskStore()
const message = useMessage()
const showCreate = ref(false)
const users = ref<User[]>([])
const filters = ref<{ 
  status?: TaskStatus[]; 
  priority?: string[]; 
  assigneeId?: number; 
  q?: string 
}>({})

const activeTask = ref<Task | null>(null)
const overId = ref<string | null>(null)

// DnD sensors
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // 5px movement to start drag
    },
  }),
  useSensor(KeyboardSensor)
)

const statusOptions = STATUSES.map(s => ({ label: STATUS_LABELS[s], value: s }))
const priorityOptions = ['P0', 'P1', 'P2'].map(p => ({ label: p, value: p }))
const userOptions = computed(() => 
  users.value.map(u => ({ label: u.displayName || u.username, value: u.id }))
)

const hasActiveFilters = computed(() => 
  !!(filters.value.status?.length || 
     filters.value.priority?.length || 
     filters.value.assigneeId || 
     filters.value.q)
)

const tasksByStatus = (status: TaskStatus) => {
  return taskStore.tasks.filter(t => {
    // Status filter
    if (filters.value.status?.length && !filters.value.status.includes(t.status)) {
      return false
    }
    // Column status
    if (t.status !== status) {
      return false
    }
    // Priority filter
    if (filters.value.priority?.length && !filters.value.priority.includes(t.priority)) {
      return false
    }
    // Assignee filter
    if (filters.value.assigneeId && t.assigneeId !== filters.value.assigneeId) {
      return false
    }
    // Search filter
    if (filters.value.q && !t.title.toLowerCase().includes(filters.value.q.toLowerCase())) {
      return false
    }
    return true
  })
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => taskStore.fetchTasks(), 300)
}

function resetFilters() { 
  filters.value = {} 
  taskStore.fetchTasks()
}

function openTask(id: number) { 
  router.push(`/app/task/${id}`) 
}

async function handleMove(taskId: number, newStatus: TaskStatus) {
  await taskStore.updateTaskStatus(taskId, newStatus)
}

function handleDragStart(event: any) {
  const taskId = parseInt(event.active.id.toString().replace('task-', ''))
  activeTask.value = taskStore.tasks.find(t => t.id === taskId) || null
}

function handleDragOver(event: any) {
  overId.value = event.over?.id || null
}

async function handleDragEnd(event: any) {
  const { active, over } = event
  
  if (!over || !activeTask.value) {
    activeTask.value = null
    overId.value = null
    return
  }

  // Extract status from column id
  const overColumnId = over.id.toString()
  if (overColumnId.startsWith('column-')) {
    const newStatus = overColumnId.replace('column-', '') as TaskStatus
    const taskId = activeTask.value.id
    
    if (activeTask.value.status !== newStatus) {
      try {
        await taskStore.updateTaskStatus(taskId, newStatus)
        message.success(`Task moved to ${STATUS_LABELS[newStatus]}`)
      } catch (error) {
        message.error('Failed to move task')
      }
    }
  }

  activeTask.value = null
  overId.value = null
}

async function handleTaskCreated() {
  await taskStore.fetchTasks()
  message.success('Task created successfully')
}

onMounted(async () => {
  taskStore.fetchTasks()
  const res = await userApi.list()
  users.value = res.data.data.items
})
</script>

<style scoped>
.board-view {
  padding: 0;
}

.filter-bar {
  transition: all 0.3s ease;
}

.filter-bar.filter-active {
  background: rgba(108, 99, 255, 0.1) !important;
  border: 1px solid rgba(108, 99, 255, 0.3);
}

.board-columns {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
  min-height: 500px;
}

.board-columns::-webkit-scrollbar {
  height: 8px;
}

.board-columns::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.board-columns::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.board-columns::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
