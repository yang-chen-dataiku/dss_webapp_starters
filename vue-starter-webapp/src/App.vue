<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = useRoute()
const router = useRouter()

const currentTab = computed(() => {
  if (route.name === 'llms') return 'llms'
  return 'projects'
})

const showTabs = computed(() => {
  return route.name === 'projects' || route.name === 'llms'
})

function onTabChange(value: string | number) {
  if (value === 'projects') {
    router.push({ name: 'projects' })
  } else if (value === 'llms') {
    router.push({ name: 'llms' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground p-6">
    <div class="mx-auto max-w-5xl">
      <Tabs v-if="showTabs" :model-value="currentTab" @update:model-value="onTabChange" class="mb-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="llms">LLMs</TabsTrigger>
        </TabsList>
      </Tabs>
      <router-view />
    </div>
  </div>
</template>
