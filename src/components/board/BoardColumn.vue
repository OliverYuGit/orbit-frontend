<template>
  <n-card :title="status" style="width: 300px; min-width: 300px; flex-shrink: 0;">
    <template #header-extra>
      <n-tag size="small">{{ tasks.length }}</n-tag>
    </template>
    <n-scrollbar style="max-height: calc(100vh - 260px);">
      <div style="display: flex; flex-direction: column; gap: 8px; padding: 4px 0;">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @click="$emit('click-task', task.id)"
          @move="(newStatus) => $emit('move', task.id, newStatus)"
        />
      </div>
    </n-scrollbar>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NTag, NScrollbar } from 'naive-ui'
import TaskCard from '@/components/task/TaskCard.vue'
import type { Task, TaskStatus } from '@/types'

defineProps<{ status: TaskStatus; tasks: Task[] }>()
defineEmits<{ 'click-task': [id: number]; move: [taskId: number, status: TaskStatus] }>()
</script>
