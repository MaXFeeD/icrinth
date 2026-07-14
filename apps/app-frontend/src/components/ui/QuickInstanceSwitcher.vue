<script setup>
import { list } from '@/helpers/profile'
import { handleError } from '@/store/notifications'
import dayjs from 'dayjs'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { profile_listener } from '@/helpers/events.js'
import NavButton from '@/components/ui/NavButton.vue'
import { Avatar } from '@icmods/ui'
import { pathToUrl } from '@/helpers/utils'
import { SpinnerIcon } from '@icmods/assets'

const allProfiles = ref([])
const recentInstances = computed(() => {
  return allProfiles.value.slice(0, maxVisible.value)
})
const maxVisible = ref(1)

const containerRef = ref(null)

const calculateMaxVisible = () => {
  const navbar = document.querySelector('.app-grid-navbar')
  const container = containerRef.value
  if (!navbar || !container) return

  const navbarHeight = navbar.clientHeight
  const otherElementsHeight = navbar.scrollHeight - container.clientHeight
  const availableSpace = navbarHeight - otherElementsHeight

  // 17px (margin) / 48px (button height) + 6px (gap) = 54px
  const count = Math.floor((availableSpace - 17) / 54)
  maxVisible.value = Math.max(0, count)
}

const getInstances = async () => {
  const profiles = await list().catch(handleError)

  allProfiles.value = profiles
    .sort((a, b) => {
      const dateACreated = dayjs(a.created)
      const dateAPlayed = a.last_played ? dayjs(a.last_played) : dayjs(0)

      const dateBCreated = dayjs(b.created)
      const dateBPlayed = b.last_played ? dayjs(b.last_played) : dayjs(0)

      const dateA = dateACreated.isAfter(dateAPlayed) ? dateACreated : dateAPlayed
      const dateB = dateBCreated.isAfter(dateBPlayed) ? dateBCreated : dateBPlayed

      if (dateA.isSame(dateB)) {
        return a.name.localeCompare(b.name)
      }

      return dateB - dateA
    })
}

await getInstances()

const unlistenProfile = profile_listener(async (event) => {
  if (event.event !== 'synced') {
    await getInstances()
  }
})

const resizeObserver = ref(null)

onMounted(() => {
  const navbar = document.querySelector('.app-grid-navbar')
  if (navbar) {
    resizeObserver.value = new ResizeObserver(calculateMaxVisible)
    resizeObserver.value.observe(navbar)
  }
  calculateMaxVisible()
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }
  unlistenProfile()
})
</script>

<template>
  <div ref="containerRef" class="flex flex-col gap-[0.375rem] items-center">
    <NavButton
      v-for="instance in recentInstances"
      :key="instance.id"
      v-tooltip.right="instance.name"
      :to="`/instance/${encodeURIComponent(instance.path)}`"
      class="relative"
    >
      <Avatar
        :src="instance.icon_path ? pathToUrl(instance.icon_path) : null"
        size="28px"
        :tint-by="instance.path"
        :class="`transition-all ${instance.install_stage !== 'installed' ? `brightness-[0.25] scale-[0.85]` : `group-hover:brightness-75`}`"
      />
      <div
        v-if="instance.install_stage !== 'installed'"
        class="absolute inset-0 flex items-center justify-center z-10"
      >
        <SpinnerIcon class="animate-spin w-4 h-4" />
      </div>
    </NavButton>
    <div v-if="recentInstances.length > 0" class="h-px w-6 mx-auto my-2 bg-button-bg shrink-0"></div>
  </div>
</template>

<style scoped lang="scss"></style>
