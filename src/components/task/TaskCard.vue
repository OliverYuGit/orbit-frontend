<template>
  <n-card
    size="small"
    hoverable
    style="cursor: pointer; border-radius: 8px;"
    @click="$emit('click')"
  >
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <n-ellipsis style="font-size: 14px; font-weight: 500; flex: 1;">{{ task.title }}</n-ellipsis>
      <n-tag :type="priorityType" size="small" style="margin-left: 8px; flex-shrink: 0;">{{ task.priority }}</n-tag>
    </div>
    <div style="margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
      <n-tag v-for="tag in task.tags.slice(0, 2)" :key="tag" size="small" round>{{ tag }}</n-tag>
      <n-tag v-if="task.tags.length > 2" size="small" round>+{{ task.tags.length - 2 }}</n-tag>
    </div>
    <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 12px; color: #646A73;">{{ task.assignee?.username ?? 'Unassigned' }}</span>
      <n-dropdown :options="moveOptions" @select="(s) => $emit('move', s)">
        <n-button size="tiny" text @click.stop>Move ▾</n-button>
      </n-dropdown>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NEllipsis, NTag, NButton, NDropdown } from 'naive-ui'
import type { Task, TaskStatus } from '@/types'

const props = defineProps<{ task: Task }>()
defineEmits<{ click: []; move: [status: TaskStatus] }>()

const STATUSES: TaskStatus[] = ['Backlog', 'Todo', 'Doing', 'Done']
const moveOptions = STATUSES
  .filter(s => s !== props.task.status)
  .map(s => ({ label: s, key: s }))

const priorityType = computed(() => ({
  P0: 'error', P1: 'warning', P2: 'default'
}[props.task.priority] as 'error' | 'warning' | 'default'))
</script>
