import api from './client'
import type { Task, FilterParams, PaginatedResponse, User, Comment, Activity } from '@/types'

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ accessToken: string; tokenType: string; expiresIn: number; user: User }>('/auth/login', { username, password }),
  me: () => api.get<User>('/auth/me'),
}

export const userApi = {
  list: (q?: string) => api.get<{ items: User[] }>('/users', { params: q ? { q } : undefined }),
}

export const taskApi = {
  list: (params?: FilterParams) => api.get<PaginatedResponse<Task>>('/tasks', { params }),
  get: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<Task>('/tasks', data),
  update: (id: number, data: Partial<Task>) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  transition: (id: number, toStatus: string) => api.post<Task>(`/tasks/${id}/transition`, { toStatus }),
  assign: (id: number, assigneeId: number | null) => api.post<Task>(`/tasks/${id}/assign`, { assigneeId }),
}

export const commentApi = {
  list: (taskId: number) => api.get<{ items: Comment[] }>(`/tasks/${taskId}/comments`),
  create: (taskId: number, content: string) => api.post<Comment>(`/tasks/${taskId}/comments`, { content }),
}

export const activityApi = {
  list: (params?: { taskId?: number; page?: number; pageSize?: number }) =>
    api.get<PaginatedResponse<Activity>>('/activities', { params }),
}
