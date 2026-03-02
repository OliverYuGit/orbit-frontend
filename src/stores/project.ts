import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectApi, type ProjectFilterParams } from '@/api/project'
import type { Project } from '@/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  async function fetchProjects(params?: ProjectFilterParams) {
    loading.value = true
    try {
      const res = await projectApi.list({ pageSize: 200, ...params })
      projects.value = res.data.data.items
    } finally {
      loading.value = false
    }
  }

  async function getProject(id: number) {
    const res = await projectApi.get(id)
    return res.data.data
  }

  async function createProject(data: Partial<Project>) {
    const res = await projectApi.create(data)
    projects.value.push(res.data.data)
    return res.data.data
  }

  async function updateProject(id: number, data: Partial<Project>) {
    const res = await projectApi.update(id, data)
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx] = res.data.data
    return res.data.data
  }

  async function deleteProject(id: number) {
    await projectApi.delete(id)
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value.splice(idx, 1)
  }

  return { 
    projects, 
    loading, 
    fetchProjects, 
    getProject,
    createProject, 
    updateProject,
    deleteProject
  }
})
