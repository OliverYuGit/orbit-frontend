export type TaskStatus = 'Backlog' | 'Todo' | 'Doing' | 'Done'
export type TaskPriority = 'P0' | 'P1' | 'P2'

export interface User {
  id: number
  username: string
}

export interface Task {
  id: number
  title: string
  desc?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: User
  created_by: User
  tags: string[]
  source?: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  task_id: number
  author: User
  content: string
  created_at: string
}

export interface Activity {
  id: number
  actor: User
  action: string
  target: string
  task_id: number
  created_at: string
}

export interface FilterParams {
  assignee?: number
  priority?: TaskPriority
  status?: TaskStatus
  tags?: string[]
  search?: string
}
