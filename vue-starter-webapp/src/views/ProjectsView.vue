<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { API, type DSSProjectSummary } from '@/Api'

// shadcn-vue components
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const projects = ref<DSSProjectSummary[] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const q = ref('')

const filtered = computed(() => {
  const list = projects.value || []
  const query = q.value.trim().toLowerCase()
  if (!query) return list
  return list.filter(p =>
    (p.name || '').toLowerCase().includes(query) ||
    (p.projectKey || '').toLowerCase().includes(query)
  )
})

onMounted(async () => {
  try {
    const response = await API.getProjects()
    projects.value = response.data
  } catch (e: any) {
    error.value = e?.message || 'Failed to load projects'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">DSS Projects</h1>
        <p class="text-sm text-muted-foreground mt-1">Click on a project to view details</p>
      </div>
      <div class="w-64">
        <Input v-model="q" type="search" placeholder="Filter by name or key" />
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
          <Skeleton class="h-4 w-40" />
        </CardContent>
      </Card>
    </div>

    <!-- Projects list -->
    <div v-else>
      <Alert v-if="!filtered || !filtered.length">
        <AlertTitle>No projects</AlertTitle>
        <AlertDescription>Try clearing the filter or check your permissions.</AlertDescription>
      </Alert>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        <RouterLink
          v-for="p in filtered"
          :key="p.projectKey"
          :to="{ name: 'project', params: { projectKey: p.projectKey } }"
          class="block group"
        >
          <Card class="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full overflow-hidden">
            <CardHeader class="flex flex-row items-center justify-between space-y-0">
              <CardTitle class="truncate pr-2">{{ p.name || p.projectKey }}</CardTitle>
              <span class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">
                &rarr;
              </span>
            </CardHeader>
            <CardContent class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground shrink-0">Key</span>
              <span class="text-xs font-mono text-muted-foreground truncate">{{ p.projectKey }}</span>
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
