import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskApi } from '@/api'
import type { Task, FilterParams } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  async function fetchTasks(params?: FilterParams) {
    loading.value = true
    try {
      const res = await taskApi.list({ pageSize: 200, ...params })
      tasks.value = res.data.items
    } finally {
      loading.value = false
    }
  }

  async function updateTaskStatus(id: number, toStatus: Task['status']) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    const prev = task.status
    task.status = toStatus // optimistic
    try {
      const res = await taskApi.transition(id, toStatus)
      // sync with server response
      const idx = tasks.value.findIndex(t => t.id === id)
      if (idx !== -1) tasks.value[idx] = res.data
    } catch {
      task.status = prev // rollback
      throw new Error('Failed to update status')
    }
  }

  async function createTask(data: Partial<Task>) {
    const res = await taskApi.create(data)
    tasks.value.push(res.data)
    return res.data
  }

  async function updateTask(id: number, data: Partial<Task>) {
    const res = await taskApi.update(id, data)
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value[idx] = res.data
    return res.data
  }

  return { tasks, loading, fetchTasks, updateTaskStatus, createTask, updateTask }
})
