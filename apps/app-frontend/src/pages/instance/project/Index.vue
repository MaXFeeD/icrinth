<template>
  <div class="p-6 pb-0">
    <InstanceIndicator :instance="instance" />
  </div>
  <div class="px-6 py-4 flex items-center gap-4">
    <Avatar v-if="icon" :src="icon" :alt="project?.name" size="64px" />
    <div class="flex flex-col">
      <span class="text-2xl font-bold text-contrast">{{ project?.name || 'Loading...' }}</span>
      <span v-if="project?.description" class="text-secondary mt-1">{{ project?.description }}</span>
    </div>
  </div>
  <div class="px-6">
    <NavTabs :links="tabs" />
  </div>
  <div class="p-6 pt-4">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component
            :is="Component"
            :instance="instance"
            :project="project"
          ></component>
          <template #fallback>
            <LoadingIndicator />
          </template>
        </Suspense>
      </template>
    </RouterView>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Avatar, LoadingIndicator } from '@icmods/ui'
import NavTabs from '@/components/ui/NavTabs.vue'
import InstanceIndicator from '@/components/ui/InstanceIndicator.vue'
import { SettingsIcon } from '@icmods/assets'
import { pathToUrl } from '@/helpers/utils.js'
import { useBreadcrumbs } from '@/store/state'

const breadcrumbs = useBreadcrumbs()

const props = defineProps({
  instance: { type: Object, required: true },
  projects: { type: Array, required: true },
  refreshProjects: { type: Function, required: true },
  projectPath: { type: String, required: true }
})
const route = useRoute()
const router = useRouter()

const project = computed(() => {
  return props.projects?.find((p) => p.path === props.projectPath) || { path: props.projectPath }
})

watch(() => project.value?.name, (newName) => {
  if (newName) {
    breadcrumbs.setName('InstanceProject', newName)
  }
}, { immediate: true })

onMounted(async () => {
  if (props.projects.length === 0) {
    await props.refreshProjects()
  }
})

const icon = computed(() => {
  return project.value?.icon ? pathToUrl(project.value.icon) : null
})

const tabs = computed(() => [
  {
    label: 'Config',
    href: `/instance/${encodeURIComponent(props.instance.path)}/project/${encodeURIComponent(props.projectPath)}/config`,
  },
  {
    label: 'Edit Instance',
    href: '#',
    shown: false
  }
])
</script>
