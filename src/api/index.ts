import api from './client'
import type { Task, FilterParams, PaginatedResponse, User, Comment, Activity, ApiResponse } from '@/types'

export { projectApi } from './project'

export const authApi = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<{ accessToken: string; tokenType: string; expiresIn: number; user: User }>>('/auth/login', { username, password }),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
}

export const userApi = {
  list: (q?: string) => api.get<{ items: User[] }>('/users', { params: q ? { q } : undefined }),
}

export const taskApi = {
  list: (params?: FilterParams) => api.get<ApiResponse<PaginatedResponse<Task>>>('/tasks', { params }),
  get: (id: number) => api.get<ApiResponse<Task>>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<ApiResponse<Task>>('/tasks', data),
  update: (id: number, data: Partial<Task>) => api.put<ApiResponse<Task>>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  transition: (id: number, toStatus: string) => api.post<ApiResponse<Task>>(`/tasks/${id}/transition`, { toStatus }),
  assign: (id: number, assigneeId: number | null) => api.post<ApiResponse<Task>>(`/tasks/${id}/assign`, { assigneeId }),
}

export const commentApi = {
  list: (taskId: number) => api.get<ApiResponse<{ items: Comment[] }>>(`/tasks/${taskId}/comments`),
  create: (taskId: number, content: string) => api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content }),
}

export const activityApi = {
  list: (params?: { taskId?: number; page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<Activity>>>('/activities', { params }),
}
