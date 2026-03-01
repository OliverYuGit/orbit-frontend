<template>
  <div v-if="task">
    <n-breadcrumb style="margin-bottom: 16px;">
      <n-breadcrumb-item @click="router.push('/app/board')">Board</n-breadcrumb-item>
      <n-breadcrumb-item>{{ task.title }}</n-breadcrumb-item>
    </n-breadcrumb>

    <n-grid :cols="3" :x-gap="16">
      <!-- Main area (2/3) -->
      <n-grid-item :span="2">
        <n-card>
          <n-input
            v-model:value="task.title"
            style="font-size: 20px; font-weight: 600;"
            @blur="saveFields({ title: task.title })"
          />
          <n-input
            v-model:value="task.description"
            type="textarea"
            :rows="4"
            placeholder="Description..."
            style="margin-top: 12px;"
            @blur="saveFields({ description: task.description })"
          />
        </n-card>

        <!-- Comments -->
        <n-card title="Comments" style="margin-top: 16px;">
          <n-list>
            <n-list-item v-for="c in comments" :key="c.id">
              <n-thing :title="c.author.displayName || c.author.username" :description="c.content">
                <template #header-extra>
                  <span style="font-size: 12px; color: #646A73;">{{ formatDate(c.createdAt) }}</span>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <n-input
              v-model:value="newComment"
              placeholder="Add a comment..."
              type="textarea"
              :rows="2"
              style="flex: 1;"
            />
            <n-button type="primary" :loading="commentLoading" @click="submitComment">Send</n-button>
          </div>
        </n-card>
      </n-grid-item>

      <!-- Sidebar (1/3) -->
      <n-grid-item>
        <n-card title="Details">
          <n-form label-placement="left" label-width="80">
            <n-form-item label="Status">
              <n-select
                v-model:value="task.status"
                :options="statusOptions"
                @update:value="handleStatusChange"
              />
            </n-form-item>
            <n-form-item label="Priority">
              <n-select
                v-model:value="task.priority"
                :options="priorityOptions"
                @update:value="v => saveFields({ priority: v })"
              />
            </n-form-item>
            <n-form-item label="Assignee">
              <n-select
                v-model:value="task.assigneeId"
                :options="userOptions"
                placeholder="Unassigned"
                clearable
                @update:value="handleAssigneeChange"
              />
            </n-form-item>
            <n-form-item label="Tags">
              <n-dynamic-tags v-model:value="task.tags" @update:value="v => saveFields({ tags: v })" />
            </n-form-item>
            <n-form-item label="Created by">
              <span style="font-size: 14px; color: #646A73;">
                {{ task.createdBy?.displayName || task.createdBy?.username }}
              </span>
            </n-form-item>
          </n-form>
        </n-card>

        <!-- Activity Timeline -->
        <n-card title="Activity" style="margin-top: 16px;">
          <n-timeline>
            <n-timeline-item
              v-for="a in activities"
              :key="a.id"
              :title="a.summary"
              :time="formatDate(a.createdAt)"
            />
          </n-timeline>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
  <n-spin v-else size="large" style="display: flex; justify-content: center; margin-top: 80px;" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard, NGrid, NGridItem, NInput, NSelect, NButton, NList, NListItem, NThing,
  NTimeline, NTimelineItem, NBreadcrumb, NBreadcrumbItem, NForm, NFormItem,
  NSpin, NDynamicTags, useMessage
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
  return new Date(iso).toLocaleString()
}

async function saveFields(data: Partial<Task>) {
  if (!task.value) return
  try {
    const res = await taskApi.update(task.value.id, data)
    Object.assign(task.value, res.data)
  } catch {
    message.error('Failed to save changes')
  }
}

async function handleStatusChange(toStatus: TaskStatus) {
  if (!task.value) return
  const prev = task.value.status
  try {
    const res = await taskApi.transition(task.value.id, toStatus)
    Object.assign(task.value, res.data)
    await refreshActivities()
  } catch {
    task.value.status = prev
    message.error('Failed to update status')
  }
}

async function handleAssigneeChange(assigneeId: number | null) {
  if (!task.value) return
  try {
    const res = await taskApi.assign(task.value.id, assigneeId)
    Object.assign(task.value, res.data)
    await refreshActivities()
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
    comments.value = res.data.items
    await refreshActivities()
  } catch {
    message.error('Failed to post comment')
  } finally {
    commentLoading.value = false
  }
}

async function refreshActivities() {
  if (!task.value) return
  const res = await activityApi.list({ taskId: task.value.id })
  activities.value = res.data.items
}

onMounted(async () => {
  const id = Number(route.params.id)
  const [t, c, a, u] = await Promise.all([
    taskApi.get(id),
    commentApi.list(id),
    activityApi.list({ taskId: id }),
    userApi.list(),
  ])
  task.value = t.data
  comments.value = c.data.items
  activities.value = a.data.items
  users.value = u.data.items
})
</script>
