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
          <n-input v-model:value="task.title" style="font-size: 20px; font-weight: 600;" @blur="saveField('title', task.title)" />
          <n-input v-model:value="task.desc" type="textarea" :rows="4" placeholder="Description..." style="margin-top: 12px;" @blur="saveField('desc', task.desc)" />
        </n-card>

        <!-- Comments -->
        <n-card title="Comments" style="margin-top: 16px;">
          <n-list>
            <n-list-item v-for="c in comments" :key="c.id">
              <n-thing :title="c.author.username" :description="c.content">
                <template #header-extra><span style="font-size: 12px; color: #646A73;">{{ c.created_at }}</span></template>
              </n-thing>
            </n-list-item>
          </n-list>
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <n-input v-model:value="newComment" placeholder="Add a comment..." type="textarea" :rows="2" style="flex: 1;" />
            <n-button type="primary" @click="submitComment">Send</n-button>
          </div>
        </n-card>
      </n-grid-item>

      <!-- Sidebar (1/3) -->
      <n-grid-item>
        <n-card title="Details">
          <n-form label-placement="left" label-width="80">
            <n-form-item label="Status">
              <n-select v-model:value="task.status" :options="statusOptions" @update:value="v => saveField('status', v)" />
            </n-form-item>
            <n-form-item label="Priority">
              <n-select v-model:value="task.priority" :options="priorityOptions" @update:value="v => saveField('priority', v)" />
            </n-form-item>
            <n-form-item label="Assignee">
              <span style="font-size: 14px;">{{ task.assignee?.username ?? 'Unassigned' }}</span>
            </n-form-item>
          </n-form>
        </n-card>

        <!-- Activity Timeline -->
        <n-card title="Activity" style="margin-top: 16px;">
          <n-timeline>
            <n-timeline-item v-for="a in activities" :key="a.id" :title="a.action" :time="a.created_at">
              {{ a.actor.username }}
            </n-timeline-item>
          </n-timeline>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
  <n-spin v-else size="large" style="display: flex; justify-content: center; margin-top: 80px;" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NGrid, NGridItem, NInput, NSelect, NButton, NList, NListItem, NThing, NTimeline, NTimelineItem, NBreadcrumb, NBreadcrumbItem, NForm, NFormItem, NSpin } from 'naive-ui'
import { taskApi, commentApi, activityApi } from '@/api'
import type { Task, Comment, Activity } from '@/types'

const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)
const comments = ref<Comment[]>([])
const activities = ref<Activity[]>([])
const newComment = ref('')

const statusOptions = ['Backlog', 'Todo', 'Doing', 'Done'].map(s => ({ label: s, value: s }))
const priorityOptions = ['P0', 'P1', 'P2'].map(p => ({ label: p, value: p }))

async function saveField(field: string, value: unknown) {
  if (!task.value) return
  await taskApi.update(task.value.id, { [field]: value })
}

async function submitComment() {
  if (!task.value || !newComment.value.trim()) return
  await commentApi.create(task.value.id, newComment.value)
  newComment.value = ''
  const res = await commentApi.list(task.value.id)
  comments.value = res.data
}

onMounted(async () => {
  const id = Number(route.params.id)
  const [t, c, a] = await Promise.all([
    taskApi.get(id),
    commentApi.list(id),
    activityApi.listByTask(id),
  ])
  task.value = t.data
  comments.value = c.data
  activities.value = a.data
})
</script>
