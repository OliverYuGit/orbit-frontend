<template>
  <div>
    <n-page-header title="Activity" />
    <n-timeline style="margin-top: 24px;">
      <n-timeline-item
        v-for="a in activities"
        :key="a.id"
        :title="`${a.actor.username} — ${a.action}`"
        :time="a.created_at"
      >
        <n-button text size="small" @click="router.push(`/app/task/${a.task_id}`)">View Task →</n-button>
      </n-timeline-item>
    </n-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPageHeader, NTimeline, NTimelineItem, NButton } from 'naive-ui'
import { activityApi } from '@/api'
import type { Activity } from '@/types'

const router = useRouter()
const activities = ref<Activity[]>([])
onMounted(async () => {
  const res = await activityApi.list()
  activities.value = res.data
})
</script>
