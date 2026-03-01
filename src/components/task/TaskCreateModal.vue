<template>
  <n-modal v-model:show="show" preset="card" title="New Task" style="width: 480px;">
    <n-form :model="form" @submit.prevent="handleSubmit">
      <n-form-item label="Title" required>
        <n-input v-model:value="form.title" placeholder="Task title" />
      </n-form-item>
      <n-form-item label="Priority">
        <n-select v-model:value="form.priority" :options="priorityOptions" />
      </n-form-item>
      <n-form-item label="Assignee">
        <n-select
          v-model:value="form.assigneeId"
          :options="userOptions"
          placeholder="Unassigned"
          clearable
        />
      </n-form-item>
      <n-form-item label="Tags">
        <n-dynamic-tags v-model:value="form.tags" />
      </n-form-item>
      <n-form-item label="Description">
        <n-input v-model:value="form.description" type="textarea" :rows="3" placeholder="Optional description" />
      </n-form-item>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <n-button @click="show = false">Cancel</n-button>
        <n-button type="primary" attr-type="submit" :loading="loading">Create</n-button>
      </div>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NModal, NForm, NFormItem, NInput, NSelect, NButton, NDynamicTags } from 'naive-ui'
import { useTaskStore } from '@/stores/tasks'
import { userApi } from '@/api'
import type { TaskPriority, User } from '@/types'

const show = defineModel<boolean>('show')
const emit = defineEmits<{ created: [] }>()
const taskStore = useTaskStore()
const loading = ref(false)
const users = ref<User[]>([])
const form = ref({
  title: '',
  priority: 'P2' as TaskPriority,
  assigneeId: null as number | null,
  tags: [] as string[],
  description: '',
})

const priorityOptions = ['P0', 'P1', 'P2'].map(p => ({ label: p, value: p }))
const userOptions = computed(() => users.value.map(u => ({ label: u.displayName || u.username, value: u.id })))

async function handleSubmit() {
  if (!form.value.title.trim()) return
  loading.value = true
  try {
    await taskStore.createTask({
      title: form.value.title,
      priority: form.value.priority,
      assigneeId: form.value.assigneeId ?? undefined,
      tags: form.value.tags,
      description: form.value.description || undefined,
    })
    show.value = false
    emit('created')
    form.value = { title: '', priority: 'P2', assigneeId: null, tags: [], description: '' }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await userApi.list()
  users.value = res.data.items
})
</script>
