<template>
  <div v-if="task" class="task-detail-view">
    <n-breadcrumb style="margin-bottom: 16px;">
      <n-breadcrumb-item 
        @click="router.push('/app/board')"
        style="cursor: pointer; color: rgba(255, 255, 255, 0.7);"
      >
        Board
      </n-breadcrumb-item>
      <n-breadcrumb-item style="color: var(--text-primary);">
        {{ task.title }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <n-grid :cols="3" :x-gap="16">
      <!-- Main area (2/3) -->
      <n-grid-item :span="2">
        <n-card 
          class="main-card"
          style="background: rgba(255, 255, 255, 0.08); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);"
        >
          <n-input
            v-model:value="task.title"
            style="font-size: 20px; font-weight: 600; background: transparent; border: none; color: var(--text-primary);"
            placeholder="Task title..."
            @blur="saveFields({ title: task.title })"
          />
          <n-input
            v-model:value="task.description"
            type="textarea"
            :rows="4"
            placeholder="Add a description..."
            style="margin-top: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; color: var(--text-primary);"
            @blur="saveFields({ description: task.description })"
          />
        </n-card>

        <!-- Comments Section -->
        <n-card 
          title="Comments" 
          class="comments-card"
          style="margin-top: 16px; background: rgba(255, 255, 255, 0.08); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);"
        >
          <template #header>
            <span style="color: var(--text-primary); font-weight: 600;">💬 Comments</span>
          </template>
          
          <n-list v-if="comments.length > 0">
            <n-list-item 
              v-for="c in comments" 
              :key="c.id"
              style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);"
            >
              <n-thing 
                :title="c.author.displayName || c.author.username" 
                :description="c.content"
                style="color: var(--text-primary);"
              >
                <template #header>
                  <span style="color: var(--text-primary); font-weight: 500;">
                    {{ c.author.displayName || c.author.username }}
                  </span>
                </template>
                <template #description>
                  <p style="color: rgba(255, 255, 255, 0.9); margin-top: 8px;">{{ c.content }}</p>
                </template>
                <template #header-extra>
                  <span style="font-size: 12px; color: rgba(255, 255, 255, 0.5);">
                    {{ formatDate(c.createdAt) }}
                  </span>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          
          <n-empty 
            v-else 
            description="No comments yet" 
            style="padding: 40px 0; color: rgba(255, 255, 255, 0.5);"
          />

          <div style="margin-top: 16px; display: flex; gap: 8px;">
            <n-input
              v-model:value="newComment"
              placeholder="Add a comment..."
              type="textarea"
              :rows="2"
              style="flex: 1; background: rgba(255, 255, 255, 0.05); border-radius: 8px; color: var(--text-primary);"
              @keydown.ctrl.enter="submitComment"
              @keydown.meta.enter="submitComment"
            />
            <n-button 
              type="primary" 
              :loading="commentLoading" 
              @click="submitComment"
              style="background: #6C63FF; border: none; align-self: flex-end;"
            >
              Send
            </n-button>
          </div>
          <div style="margin-top: 4px; font-size: 12px; color: rgba(255, 255, 255, 0.5);">
            Press Ctrl+Enter (⌘+Enter) to send
          </div>
        </n-card>
      </n-grid-item>

      <!-- Sidebar (1/3) -->
      <n-grid-item>
        <n-card 
          title="Details" 
          class="sidebar-card"
          style="background: rgba(255, 255, 255, 0.08); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);"
        >
          <template #header>
            <span style="color: var(--text-primary); font-weight: 600;">📋 Details</span>
          </template>
          
          <n-form label-placement="left" label-width="80">
            <n-form-item label="Status">
              <n-select
                v-model:value="task.status"
                :options="statusOptions"
                @update:value="handleStatusChange"
                style="background: rgba(255, 255, 255, 0.05);"
              />
            </n-form-item>
            <n-form-item label="Priority">
              <n-select
                v-model:value="task.priority"
                :options="priorityOptions"
                @update:value="v => saveFields({ priority: v })"
                style="background: rgba(255, 255, 255, 0.05);"
              />
            </n-form-item>
            <n-form-item label="Assignee">
              <n-select
                v-model:value="task.assigneeId"
                :options="userOptions"
                placeholder="Unassigned"
                clearable
                @update:value="handleAssigneeChange"
                style="background: rgba(255, 255, 255, 0.05);"
              />
            </n-form-item>
            <n-form-item label="Tags">
              <n-dynamic-tags 
                v-model:value="task.tags" 
                @update:value="(v: string[]) => saveFields({ tags: v })"
                style="width: 100%;"
              />
            </n-form-item>
            <n-form-item label="Created by">
              <span style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">
                {{ task.createdBy?.displayName || task.createdBy?.username }}
              </span>
            </n-form-item>
          </n-form>
        </n-card>

        <!-- Activity Timeline -->
        <n-card 
          title="Activity" 
          class="activity-card"
          style="margin-top: 16px; background: rgba(255, 255, 255, 0.08); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);"
        >
          <template #header>
            <span style="color: var(--text-primary); font-weight: 600;">⚡ Activity</span>
          </template>
          
          <n-timeline v-if="activities.length > 0">
            <n-timeline-item
              v-for="a in activities"
              :key="a.id"
              :title="a.summary"
              :time="formatDate(a.createdAt)"
              type="info"
              :color="getActivityColor(a.summary)"
            >
              <template #default>
                <span style="color: rgba(255, 255, 255, 0.9);">{{ a.summary }}</span>
              </template>
            </n-timeline-item>
          </n-timeline>
          
          <n-empty 
            v-else 
            description="No activity yet" 
            style="padding: 40px 0; color: rgba(255, 255, 255, 0.5);"
          />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
  
  <div v-else class="loading-container">
    <n-spin size="large" style="color: #6C63FF;" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard, NGrid, NGridItem, NInput, NSelect, NButton, NList, NListItem, NThing,
  NTimeline, NTimelineItem, NBreadcrumb, NBreadcrumbItem, NForm, NFormItem,
  NSpin, NDynamicTags, NEmpty, useMessage
} from 'naive-ui'
import { taskApi, commentApi, activityApi, userApi } from '@/api'
import type { Task, Comment, Activity, User, TaskStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const task = ref<Task | null>(null)
const comments = ref<Comment[]>([])
const activities = ref<Activity[]>([])
const users = ref<User[]>([])
const newComment = ref('')
const commentLoading = ref(false)

const statusOptions = [
  { label: 'Backlog', value: 'BACKLOG' },
  { label: 'Todo', value: 'TODO' },
  { label: 'Doing', value: 'DOING' },
  { label: 'Done', value: 'DONE' },
]
const priorityOptions = ['P0', 'P1', 'P2'].map(p => ({ label: p, value: p }))
const userOptions = computed(() => [
  ...users.value.map(u => ({ label: u.displayName || u.username, value: u.id }))
])

function formatDate(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function getActivityColor(summary: string): string {
  if (summary.includes('created')) return '#4ECDC4'
  if (summary.includes('completed') || summary.includes('Done')) return '#00B42A'
  if (summary.includes('commented')) return '#6C63FF'
  if (summary.includes('assigned')) return '#FF9A2E'
  return '#C9CDD4'
}

async function saveFields(data: Partial<Task>) {
  if (!task.value) return
  try {
    const res = await taskApi.update(task.value.id, data)
    Object.assign(task.value, res.data.data)
    message.success('Changes saved')
  } catch {
    message.error('Failed to save changes')
  }
}

async function handleStatusChange(toStatus: TaskStatus) {
  if (!task.value) return
  const prev = task.value.status
  try {
    const res = await taskApi.transition(task.value.id, toStatus)
    Object.assign(task.value, res.data.data)
    await refreshActivities()
    message.success(`Status updated to ${toStatus}`)
  } catch {
    task.value.status = prev
    message.error('Failed to update status')
  }
}

async function handleAssigneeChange(assigneeId: number | null) {
  if (!task.value) return
  try {
    const res = await taskApi.assign(task.value.id, assigneeId)
    Object.assign(task.value, res.data.data)
    await refreshActivities()
    message.success('Assignee updated')
  } catch {
    message.error('Failed to update assignee')
  }
}

async function submitComment() {
  if (!task.value || !newComment.value.trim()) return
  commentLoading.value = true
  try {
    await commentApi.create(task.value.id, newComment.value)
    newComment.value = ''
    const res = await commentApi.list(task.value.id)
    comments.value = res.data.data.items
    await refreshActivities()
    message.success('Comment posted')
  } catch {
    message.error('Failed to post comment')
  } finally {
    commentLoading.value = false
  }
}

async function refreshActivities() {
  if (!task.value) return
  const res = await activityApi.list({ taskId: task.value.id })
  activities.value = res.data.data.items
}

onMounted(async () => {
  const id = Number(route.params.id)
  const [t, c, a, u] = await Promise.all([
    taskApi.get(id),
    commentApi.list(id),
    activityApi.list({ taskId: id }),
    userApi.list(),
  ])
  task.value = t.data.data
  comments.value = c.data.data.items
  activities.value = a.data.data.items
  users.value = u.data.data.items
})
</script>

<style scoped>
.task-detail-view {
  padding: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.main-card,
.comments-card,
.sidebar-card,
.activity-card {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.main-card:hover,
.comments-card:hover,
.sidebar-card:hover,
.activity-card:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

:deep(.n-input__input-el) {
  color: var(--text-primary) !important;
}

:deep(.n-input__textarea-el) {
  color: var(--text-primary) !important;
}

:deep(.n-form-item-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>
