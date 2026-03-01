<template>
  <div>
    <n-page-header title="Mission Board">
      <template #extra>
        <n-button type="primary" @click="showCreate = true">+ New Task</n-button>
      </template>
    </n-page-header>

    <!-- Filter Bar -->
    <n-space style="margin: 16px 0;" align="center" wrap>
      <n-select
        v-model:value="filters.status"
        :options="statusOptions"
        placeholder="Status"
        clearable
        style="width: 140px;"
      />
      <n-select
        v-model:value="filters.priority"
        :options="priorityOptions"
        placeholder="Priority"
        clearable
        style="width: 120px;"
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
        placeholder="Search..."
        clearable
        style="width: 180px;"
        @update:value="debouncedFetch"
      />
      <n-button @click="resetFilters">Reset</n-button>
    </n-space>

    <!-- Board Columns -->
    <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px;">
      <BoardColumn
        v-for="status in STATUSES"
        :key="status"
        :status="status"
        :tasks="tasksByStatus(status)"
        @move="handleMove"
        @click-task="openTask"
      />
    </div>

    <!-- Create Task Modal -->
    <TaskCreateModal v-model:show="showCreate" @created="taskStore.fetchTasks()" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NButton, NSpace, NSelect, NInput } from 'naive-ui'
import { useTaskStore } from '@/stores/tasks'
import { userApi } from '@/api'
import BoardColumn from '@/components/board/BoardColumn.vue'
import TaskCreateModal from '@/components/task/TaskCreateModal.vue'
import type { TaskStatus, User } from '@/types'

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'DOING', 'DONE']
const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog', TODO: 'Todo', DOING: 'Doing', DONE: 'Done'
}

const router = useRouter()
const taskStore = useTaskStore()
const showCreate = ref(false)
const users = ref<User[]>([])
const filters = ref<{ status?: TaskStatus; priority?: string; assigneeId?: number; q?: string }>({})

const statusOptions = STATUSES.map(s => ({ label: STATUS_LABELS[s], value: s }))
const priorityOptions = ['P0', 'P1', 'P2'].map(p => ({ label: p, value: p }))
const userOptions = computed(() => users.value.map(u => ({ label: u.displayName || u.username, value: u.id })))

const tasksByStatus = (status: TaskStatus) =>
  taskStore.tasks.filter(t => t.status === status &&
    (!filters.value.status || t.status === filters.value.status) &&
    (!filters.value.priority || t.priority === filters.value.priority) &&
    (!filters.value.assigneeId || t.assigneeId === filters.value.assigneeId) &&
    (!filters.value.q || t.title.toLowerCase().includes(filters.value.q.toLowerCase())))

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => taskStore.fetchTasks(), 300)
}

function resetFilters() { filters.value = {} }
function openTask(id: number) { router.push(`/app/task/${id}`) }

async function handleMove(taskId: number, newStatus: TaskStatus) {
  await taskStore.updateTaskStatus(taskId, newStatus)
}

onMounted(async () => {
  taskStore.fetchTasks()
  const res = await userApi.list()
  users.value = res.data.items
})
</script>
