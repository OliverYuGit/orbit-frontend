<template>
  <div class="project-detail-view" v-if="project">
    <!-- Header -->
    <div class="detail-header">
      <n-button text @click="router.back()" style="margin-right: 12px;">
        <template #icon>
          <n-icon :component="ArrowBackOutline" />
        </template>
        返回项目列表
      </n-button>
      <h1 class="project-title">{{ project.name }}</h1>
      <div style="margin-left: auto; display: flex; gap: 12px;">
        <n-button @click="showEditModal = true">编辑</n-button>
        <n-button type="error" @click="handleDelete">删除</n-button>
      </div>
    </div>

    <!-- Project Info Card -->
    <n-card title="项目信息" class="info-card">
      <div class="info-grid">
        <div class="info-item">
          <span class="label">项目名称：</span>
          <span class="value">{{ project.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">负责人：</span>
          <span class="value">{{ project.owner?.displayName || project.owner?.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">状态：</span>
          <n-tag :type="getStatusType(project.status)">
            {{ getStatusLabel(project.status) }}
          </n-tag>
        </div>
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ formatDate(project.createdAt) }}</span>
        </div>
        <div class="info-item" v-if="project.deadline">
          <span class="label">截止时间：</span>
          <span class="value">{{ formatDate(project.deadline) }}</span>
        </div>
        <div class="info-item full-width" v-if="project.description">
          <span class="label">项目描述：</span>
          <p class="description">{{ project.description }}</p>
        </div>
      </div>
    </n-card>

    <!-- Progress Card -->
    <n-card title="项目进度" class="progress-card">
      <div class="progress-section">
        <div class="progress-header">
          <span class="label">总体进度：</span>
          <span class="value">{{ project.progress || 0 }}%</span>
        </div>
        <n-progress 
          type="line" 
          :percentage="project.progress || 0" 
          :height="12"
          style="margin-top: 8px;"
        />
      </div>
      
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">总任务</div>
          <div class="stat-value">{{ project.taskCount || 0 }}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">已完成</div>
          <div class="stat-value success">{{ project.completedTaskCount || 0 }}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">进行中</div>
          <div class="stat-value warning">{{ (project.taskCount || 0) - (project.completedTaskCount || 0) }}</div>
        </div>
      </div>
    </n-card>

    <!-- Tasks Card -->
    <n-card title="项目任务" class="tasks-card">
      <template #header-extra>
        <n-button type="primary" size="small" @click="handleCreateTask">
          + 新建任务
        </n-button>
      </template>
      
      <div v-if="tasks.length > 0" class="task-list">
        <div 
          v-for="task in tasks" 
          :key="task.id"
          class="task-item"
          @click="goToTask(task.id)"
        >
          <div class="task-checkbox">
            <n-icon 
              :component="task.status === 'DONE' ? CheckboxOutline : SquareOutline" 
              size="20"
              :style="{ color: task.status === 'DONE' ? '#52c41a' : 'inherit' }"
            />
          </div>
          <div class="task-content">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-meta">
              <n-tag size="small" :type="getPriorityType(task.priority)">
                {{ task.priority }}
              </n-tag>
              <n-tag size="small" :type="getTaskStatusType(task.status)">
                {{ getTaskStatusLabel(task.status) }}
              </n-tag>
              <span v-if="task.assignee" class="assignee">
                <n-icon :component="PersonOutline" size="14" />
                {{ task.assignee.displayName || task.assignee.username }}
              </span>
              <span v-if="task.dueAt" class="due-date">
                <n-icon :component="CalendarOutline" size="14" />
                {{ formatDate(task.dueAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-tasks">
        <n-icon :component="ListOutline" size="48" style="opacity: 0.3;" />
        <p style="margin-top: 12px; opacity: 0.6;">暂无任务</p>
        <n-button type="primary" size="small" @click="handleCreateTask" style="margin-top: 12px;">
          + 创建第一个任务
        </n-button>
      </div>
    </n-card>

    <!-- Edit Modal -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑项目" style="width: 600px;">
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
        <n-form-item label="状态" path="status">
          <n-select 
            v-model:value="formData.status" 
            :options="statusOptions" 
            placeholder="选择状态"
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
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" @click="handleUpdate" :loading="updating">保存</n-button>
        </div>
      </template>
    </n-modal>
  </div>
  
  <div v-else class="loading-state">
    <n-spin size="large" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  NButton, NCard, NIcon, NTag, NProgress, NModal, NForm, NFormItem, 
  NInput, NSelect, NDatePicker, NSpin, useMessage, useDialog 
} from 'naive-ui'
import { 
  ArrowBackOutline, CheckboxOutline, SquareOutline, PersonOutline, 
  CalendarOutline, ListOutline 
} from '@vicons/ionicons5'
import { useProjectStore } from '@/stores/project'
import { useTaskStore } from '@/stores/tasks'
import { userApi } from '@/api'
import type { Project, Task, User, ProjectStatus, TaskStatus, TaskPriority } from '@/types'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const message = useMessage()
const dialog = useDialog()

const project = ref<Project | null>(null)
const tasks = ref<Task[]>([])
const users = ref<User[]>([])
const showEditModal = ref(false)
const updating = ref(false)

const formRef = ref()
const formData = ref({
  name: '',
  ownerId: undefined as number | undefined,
  status: 'ACTIVE' as ProjectStatus,
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

function getStatusLabel(status: ProjectStatus) {
  const map = { PLANNING: '计划中', ACTIVE: '进行中', PAUSED: '已暂停', COMPLETED: '已完成' }
  return map[status]
}

function getStatusType(status: ProjectStatus) {
  const map = { PLANNING: 'warning', ACTIVE: 'success', PAUSED: 'error', COMPLETED: 'default' }
  return map[status] as any
}

function getTaskStatusLabel(status: TaskStatus) {
  const map = { BACKLOG: 'Backlog', TODO: 'Todo', DOING: 'Doing', DONE: 'Done' }
  return map[status]
}

function getTaskStatusType(status: TaskStatus) {
  const map = { BACKLOG: 'default', TODO: 'info', DOING: 'warning', DONE: 'success' }
  return map[status] as any
}

function getPriorityType(priority: TaskPriority) {
  const map = { P0: 'error', P1: 'warning', P2: 'default' }
  return map[priority] as any
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function goToTask(id: number) {
  router.push(`/app/task/${id}`)
}

function handleCreateTask() {
  router.push(`/app/board?projectId=${project.value?.id}`)
}

async function handleUpdate() {
  try {
    await formRef.value?.validate()
    updating.value = true
    
    const data: any = {
      name: formData.value.name,
      ownerId: formData.value.ownerId,
      status: formData.value.status,
      description: formData.value.description || undefined
    }
    
    if (formData.value.deadline) {
      data.deadline = new Date(formData.value.deadline).toISOString()
    }
    
    await projectStore.updateProject(Number(route.params.id), data)
    await loadProject()
    message.success('项目更新成功')
    showEditModal.value = false
  } catch (error) {
    message.error('更新失败')
  } finally {
    updating.value = false
  }
}

function handleDelete() {
  dialog.warning({
    title: '确认删除',
    content: '确定要删除这个项目吗？此操作不可恢复。',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await projectStore.deleteProject(Number(route.params.id))
        message.success('项目已删除')
        router.push('/app/projects')
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

async function loadProject() {
  const id = Number(route.params.id)
  project.value = await projectStore.getProject(id)
  
  // Load tasks for this project
  await taskStore.fetchTasks({ projectId: id } as any)
  tasks.value = taskStore.tasks.filter(t => t.projectId === id)
  
  // Populate form data
  formData.value = {
    name: project.value.name,
    ownerId: project.value.ownerId,
    status: project.value.status,
    deadline: project.value.deadline ? new Date(project.value.deadline).getTime() : null,
    description: project.value.description || ''
  }
}

onMounted(async () => {
  await loadProject()
  const res = await userApi.list()
  users.value = res.data.data
})
</script>

<style scoped>
.project-detail-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.project-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.info-card, .progress-card, .tasks-card {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
  flex-direction: column;
}

.info-item .label {
  font-weight: 500;
  opacity: 0.7;
  min-width: 80px;
}

.info-item .value {
  flex: 1;
}

.description {
  margin: 8px 0 0 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.stat-box {
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
}

.stat-value.success {
  color: #52c41a;
}

.stat-value.warning {
  color: #faad14;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.task-checkbox {
  flex-shrink: 0;
  margin-top: 2px;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  opacity: 0.8;
}

.assignee, .due-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
