<template>
  <n-modal v-model:show="show" preset="card" title="New Task" style="width: 480px;">
    <n-form :model="form" @submit.prevent="handleSubmit">
      <n-form-item label="Title" required>
        <n-input v-model:value="form.title" placeholder="Task title" />
      </n-form-item>
      <n-form-item label="Priority">
        <n-select v-model:value="form.priority" :options="priorityOptions" />
      </n-form-item>
      <n-form-item label="Status">
        <n-select v-model:value="form.status" :options="statusOptions" />
      </n-form-item>
      <n-form-item label="Description">
        <n-input v-model:value="form.desc" type="textarea" :rows="3" placeholder="Optional description" />
      </n-form-item>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <n-button @click="show = false">Cancel</n-button>
        <n-button type="primary" attr-type="submit" :loading="loading">Create</n-button>
      </div>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NForm, NFormItem, NInput, NSelect, NButton } from 'naive-ui'
import { useTaskStore } from '@/stores/tasks'
import type { TaskStatus, TaskPriority } from '@/types'

const show = defineModel<boolean>('show')
const emit = defineEmits<{ created: [] }>()
const taskStore = useTaskStore()
const loading = ref(false)
const form = ref({ title: '', priority: 'P2' as TaskPriority, status: 'Backlog' as TaskStatus, desc: '' })

const priorityOptions = ['P0', 'P1', 'P2'].map(p => ({ label: p, value: p }))
const statusOptions = ['Backlog', 'Todo', 'Doing', 'Done'].map(s => ({ label: s, value: s }))

async function handleSubmit() {
  if (!form.value.title.trim()) return
  loading.value = true
  try {
    await taskStore.createTask(form.value)
    show.value = false
    emit('created')
    form.value = { title: '', priority: 'P2', status: 'Backlog', desc: '' }
  } finally {
    loading.value = false
  }
}
</script>
