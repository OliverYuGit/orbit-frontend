<template>
  <div class="project-list-view">
    <n-page-header title="项目管理" style="padding-top: 12px; padding-left: 24px;" />

    <!-- Filter Bar -->
    <div 
      :class="['filter-bar', { 'filter-active': hasActiveFilters }]"
      style="margin: 16px 24px; padding: 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; gap: 12px;"
    >
      <div style="display: flex; align-items: center; gap: 12px; flex: 1; flex-wrap: wrap;">
        <n-select
          v-model:value="filters.status"
          :options="statusOptions"
          placeholder="状态筛选"
          clearable
          multiple
          style="width: 160px;"
        />
        <n-select
          v-model:value="filters.ownerId"
          :options="userOptions"
          placeholder="负责人"
          clearable
          style="width: 150px;"
        />
        <n-input
          v-model:value="filters.q"
          placeholder="搜索项目..."
          clearable
          style="width: 200px;"
          @update:value="debouncedFetch"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" style="opacity: 0.5;" />
          </template>
        </n-input>
        <n-button 
          @click="resetFilters"
          :type="hasActiveFilters ? 'warning' : 'default'"
          ghost
        >
          重置
        </n-button>
      </div>
      <n-button 
        type="primary" 
        @click="showCreateModal = true"
        style="background: #6C63FF; border: none; margin-left: auto;"
      >
        + 新建项目
      </n-button>
    </div>

    <!-- Project Cards Grid -->
    <div class="project-grid" v-if="!projectStore.loading && projectStore.projects.length > 0">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id"
        class="project-card"
        @click="goToDetail(project.id)"
      >
        <div class="card-header">
          <span class="status-dot" :class="`status-${project.status.toLowerCase()}`"></span>
          <h3 class="project-name">{{ project.name }}</h3>
        </div>
        <div class="card-divider"></div>
        
        <div class="card-body">
          <div class="project-info">
            <div class="info-item">
              <span class="label">进度：</span>
              <span class="value">{{ project.progress || 0 }}%</span>
            </div>
            <n-progress 
              type="line" 
              :percentage="project.progress || 0" 
              :show-indicator="false"
              :height="6"
              :border-radius="3"
              style="margin-top: 4px;"
            />
          </div>

          <div class="project-stats">
            <div class="stat-item">
              <n-icon :component="ListOutline" size="14" style="opacity: 0.6;" />
              <span>任务：{{ project.completedTaskCount || 0 }}/{{ project.taskCount || 0 }}</span>
            </div>
            <div class="stat-item">
              <n-icon :component="PersonOutline" size="14" style="opacity: 0.6;" />
              <span>{{ project.owner?.displayName || project.owner?.username }}</span>
            </div>
            <div class="stat-item" v-if="project.deadline">
              <n-icon :component="CalendarOutline" size="14" style="opacity: 0.6;" />
              <span>{{ formatDate(project.deadline) }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <n-button text @click.stop="goToDetail(project.id)">
            查看详情
          </n-button>
        </div>
      </div>

      <!-- Add New Card -->
      <div class="project-card add-card" @click="showCreateModal = true">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.6;">
          <n-icon :component="AddOutline" size="48" />
          <span style="margin-top: 8px;">新建项目</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!projectStore.loading && projectStore.projects.length === 0" class="empty-state">
      <n-icon :component="FolderOpenOutline" size="64" style="opacity: 0.3;" />
      <p style="margin-top: 16px; opacity: 0.6;">还没有项目</p>
      <n-button type="primary" @click="showCreateModal = true" style="margin-top: 16px;">
        + 创建第一个项目
      </n-button>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <n-spin size="large" />
    </div>

    <!-- Create/Edit Modal -->
    <n-modal v-model:show="showCreateModal" preset="card" title="新建项目" style="width: 600px;">
      <n-form ref="formRef" :model="formData" :rules="formRules" label-placement="left" label-width="80">
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入项目名称" />
        </n-form-item>
        <n-form-item label="负责人" path="ownerId">
          <n-select 
            v-model:value="formData.ownerId" 
            :options="userOptions" 
            placeholder="选择负责人"
          />
        </n-form-item>
        <n-form-item label="截止时间" path="deadline">
          <n-date-picker 
            v-model:value="formData.deadline" 
            type="date"
            placeholder="选择截止时间"
            style="width: 100%;"
          />
        </n-form-item>
        <n-form-item label="项目描述" path="description">
          <n-input 
            v-model:value="formData.description" 
            type="textarea" 
            placeholder="请输入项目描述"
            :rows="4"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" @click="handleCreate" :loading="creating">创建</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NPageHeader, NButton, NSelect, NInput, NIcon, NProgress, 
  NModal, NForm, NFormItem, NDatePicker, NSpin, useMessage 
} from 'naive-ui'
import { 
  SearchOutline, ListOutline, PersonOutline, CalendarOutline, 
  AddOutline, FolderOpenOutline 
} from '@vicons/ionicons5'
import { useProjectStore } from '@/stores/project'
import { userApi } from '@/api'
import type { ProjectStatus, User } from '@/types'

const router = useRouter()
const projectStore = useProjectStore()
const message = useMessage()

const showCreateModal = ref(false)
const creating = ref(false)
const users = ref<User[]>([])
const filters = ref<{ status?: ProjectStatus[]; ownerId?: number; q?: string }>({})

const formRef = ref()
const formData = ref({
  name: '',
  ownerId: undefined as number | undefined,
  deadline: null as number | null,
  description: ''
})

const formRules = {
  name: { required: true, message: '请输入项目名称', trigger: 'blur' },
  ownerId: { required: true, message: '请选择负责人', trigger: 'change', type: 'number' }
}

const statusOptions = [
  { label: '🟡 计划中', value: 'PLANNING' },
  { label: '🟢 进行中', value: 'ACTIVE' },
  { label: '🔴 已暂停', value: 'PAUSED' },
  { label: '⚫ 已完成', value: 'COMPLETED' }
]

const userOptions = computed(() => 
  users.value.map(u => ({ label: u.displayName || u.username, value: u.id }))
)

const hasActiveFilters = computed(() => 
  !!(filters.value.status?.length || filters.value.ownerId || filters.value.q)
)

const filteredProjects = computed(() => {
  return projectStore.projects.filter(p => {
    if (filters.value.status?.length && !filters.value.status.includes(p.status)) {
      return false
    }
    if (filters.value.ownerId && p.ownerId !== filters.value.ownerId) {
      return false
    }
    if (filters.value.q && !p.name.toLowerCase().includes(filters.value.q.toLowerCase())) {
      return false
    }
    return true
  })
})

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => projectStore.fetchProjects(), 300)
}

function resetFilters() {
  filters.value = {}
  projectStore.fetchProjects()
}

function goToDetail(id: number) {
  router.push(`/app/project/${id}`)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

async function handleCreate() {
  try {
    await formRef.value?.validate()
    creating.value = true
    
    const data: any = {
      name: formData.value.name,
      ownerId: formData.value.ownerId,
      description: formData.value.description || undefined
    }
    
    if (formData.value.deadline) {
      data.deadline = new Date(formData.value.deadline).toISOString()
    }
    
    await projectStore.createProject(data)
    message.success('项目创建成功')
    showCreateModal.value = false
    formData.value = { name: '', ownerId: undefined, deadline: null, description: '' }
  } catch (error) {
    message.error('创建失败')
  } finally {
    creating.value = false
  }
}

onMounted(async () => {
  projectStore.fetchProjects()
  const res = await userApi.list()
  users.value = res.data.data
})
</script>

<style scoped>
.project-list-view {
  padding: 0;
  min-height: 100vh;
}

.filter-bar {
  transition: all 0.3s ease;
}

.filter-bar.filter-active {
  background: rgba(108, 99, 255, 0.1) !important;
  border: 1px solid rgba(108, 99, 255, 0.3);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 0 24px 24px 24px;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 240px;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.add-card {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  background: transparent;
}

.add-card:hover {
  border-color: #6C63FF;
  background: rgba(108, 99, 255, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.status-planning { background: #faad14; }
.status-dot.status-active { background: #52c41a; }
.status-dot.status-paused { background: #f5222d; }
.status-dot.status-completed { background: #8c8c8c; }

.project-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-info .info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
}

.project-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-state, .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
