import api from './client'
import type { Project, ApiResponse, PaginatedResponse } from '@/types'

export interface ProjectFilterParams {
  status?: string
  ownerId?: number
  goalId?: number
  q?: string
  page?: number
  pageSize?: number
  sort?: string
}

export const projectApi = {
  list: (params?: ProjectFilterParams) => 
    api.get<ApiResponse<PaginatedResponse<Project>>>('/projects', { params }),
  
  get: (id: number) => 
    api.get<ApiResponse<Project>>(`/projects/${id}`),
  
  create: (data: Partial<Project>) => 
    api.post<ApiResponse<Project>>('/projects', data),
  
  update: (id: number, data: Partial<Project>) => 
    api.put<ApiResponse<Project>>(`/projects/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/projects/${id}`),
}
