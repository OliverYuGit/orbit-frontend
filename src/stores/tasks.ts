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
      const res = await taskApi.list(params)
      tasks.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function updateTaskStatus(id: number, status: Task['status']) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    const prev = task.status
    task.status = status // optimistic
    try {
      await taskApi.update(id, { status })
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

  return { tasks, loading, fetchTasks, updateTaskStatus, createTask }
})
