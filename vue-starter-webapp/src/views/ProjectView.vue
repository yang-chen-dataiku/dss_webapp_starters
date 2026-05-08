<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { API, type DSSProjectSummary } from '@/Api'

import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const props = defineProps<{
  projectKey: string
}>()

const router = useRouter()
const project = ref<DSSProjectSummary | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await API.getProjects()
    project.value = response.data.find(p => p.projectKey === props.projectKey) || null
    if (!project.value) {
      error.value = `Project "${props.projectKey}" not found`
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load project'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push({ name: 'projects' })
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <Button variant="ghost" @click="goBack" class="mb-4">
      ← Back to projects
    </Button>

    <Alert v-if="error" variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Loading skeleton -->
    <Card v-if="loading">
      <CardHeader>
        <Skeleton class="h-8 w-1/2" />
      </CardHeader>
      <CardContent class="space-y-4">
        <Skeleton class="h-4 w-32" />
        <Skeleton class="h-4 w-48" />
        <Skeleton class="h-4 w-40" />
      </CardContent>
    </Card>

    <!-- Project details -->
    <Card v-else-if="project">
      <CardHeader>
        <CardTitle class="text-2xl">{{ project.name || project.projectKey }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground">Project Key:</span>
          <Badge variant="outline">{{ project.projectKey }}</Badge>
        </div>

        <div v-if="project.shortDesc" class="space-y-1">
          <span class="text-sm font-medium text-muted-foreground">Description:</span>
          <p class="text-sm">{{ project.shortDesc }}</p>
        </div>

        <div v-if="project.owner" class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground">Owner:</span>
          <span class="text-sm">{{ project.owner }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
