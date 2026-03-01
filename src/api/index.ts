import api from './client'
import type { Task, FilterParams } from '@/types'

export const taskApi = {
  list: (params?: FilterParams) => api.get<Task[]>('/tasks', { params }),
  get: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<Task>('/tasks', data),
  update: (id: number, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ token: string; user: { id: number; username: string } }>('/auth/login', { username, password }),
}

export const commentApi = {
  list: (taskId: number) => api.get(`/tasks/${taskId}/comments`),
  create: (taskId: number, content: string) => api.post(`/tasks/${taskId}/comments`, { content }),
}

export const activityApi = {
  list: (params?: FilterParams) => api.get('/activities', { params }),
  listByTask: (taskId: number) => api.get(`/tasks/${taskId}/activities`),
}
