<template>
  <div>
    <n-page-header title="Activity" />
    <n-timeline style="margin-top: 24px;">
      <n-timeline-item
        v-for="a in activities"
        :key="a.id"
        :title="a.summary"
        :time="formatDate(a.createdAt)"
      >
        <n-button text size="small" @click="router.push(`/app/task/${a.taskId}`)">View Task →</n-button>
      </n-timeline-item>
    </n-timeline>
    <n-empty v-if="!activities.length && !loading" description="No activity yet" style="margin-top: 48px;" />
    <div v-if="loading" style="display: flex; justify-content: center; margin-top: 48px;">
      <n-spin size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NTimeline, NTimelineItem, NButton, NEmpty, NSpin } from 'naive-ui'
import { activityApi } from '@/api'
import type { Activity } from '@/types'

const router = useRouter()
const activities = ref<Activity[]>([])
const loading = ref(false)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await activityApi.list({ pageSize: 50 })
    activities.value = res.data.data.items
  } finally {
    loading.value = false
  }
})
</script>
