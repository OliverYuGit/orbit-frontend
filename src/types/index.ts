export type TaskStatus = 'BACKLOG' | 'TODO' | 'DOING' | 'DONE'
export type TaskPriority = 'P0' | 'P1' | 'P2'

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    code: string
    message: string
  }
}

export interface User {
  id: number
  username: string
  displayName: string
  avatarUrl?: string | null
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: number | null
  assignee?: User | null
  createdById: number
  createdBy?: User
  tags: string[]
  source?: string
  dueAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  taskId: number
  author: User
  content: string
  createdAt: string
}

export interface Activity {
  id: number
  taskId: number
  actor: User
  type: string
  summary: string
  payload?: Record<string, unknown>
  createdAt: string
}

export interface PaginatedResponse<T> {
  total?: number
  page?: number
  pageSize?: number
  items: T[]
}

export interface FilterParams {
  assigneeId?: number
  priority?: TaskPriority
  status?: string
  tag?: string
  q?: string
  page?: number
  pageSize?: number
  sort?: string
}
