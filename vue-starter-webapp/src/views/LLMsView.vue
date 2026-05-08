<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { API, type LLMItem } from '@/Api'

import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const llms = ref<LLMItem[] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const q = ref('')
const copiedId = ref<string | null>(null)

const filtered = computed(() => {
  const list = llms.value || []
  const query = q.value.trim().toLowerCase()
  if (!query) return list
  return list.filter(l =>
    (l.id || '').toLowerCase().includes(query) ||
    (l.description || '').toLowerCase().includes(query) ||
    (l.type || '').toLowerCase().includes(query)
  )
})

async function copyId(id: string) {
  await navigator.clipboard.writeText(id)
  copiedId.value = id
  setTimeout(() => { copiedId.value = null }, 1500)
}

onMounted(async () => {
  try {
    const response = await API.getLLMs()
    llms.value = response.data
  } catch (e: any) {
    error.value = e?.message || 'Failed to load LLMs'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">LLMs</h1>
        <p class="text-sm text-muted-foreground mt-1">Available LLMs in DSS</p>
      </div>
      <div class="w-64">
        <Input v-model="q" type="search" placeholder="Filter by ID" />
      </div>
    </div>

    <Alert v-if="error" variant="destructive">
      <AlertTitle>Failed to load</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Loading skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="n in 6" :key="n">
        <CardHeader>
          <Skeleton class="h-5 w-3/4" />
        </CardHeader>
        <CardContent class="space-y-2">
          <Skeleton class="h-4 w-24" />
        </CardContent>
      </Card>
    </div>

    <!-- LLMs list -->
    <div v-else>
      <Alert v-if="!filtered || !filtered.length">
        <AlertTitle>No LLMs</AlertTitle>
        <AlertDescription>No LLMs are configured or match your filter.</AlertDescription>
      </Alert>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
        <Card v-for="l in filtered" :key="l.id" class="h-full">
          <CardHeader class="pb-2">
            <div class="flex items-start justify-between gap-2">
              <CardTitle class="text-sm text-muted-foreground">{{ l.description }}</CardTitle>
              <Badge variant="outline" class="shrink-0">{{ l.type }}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-2">
              <code class="flex-1 bg-muted px-2 py-1 rounded text-sm font-mono select-all break-all">{{ l.id }}</code>
              <Button variant="ghost" size="sm" @click="copyId(l.id)" class="shrink-0">
                {{ copiedId === l.id ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
