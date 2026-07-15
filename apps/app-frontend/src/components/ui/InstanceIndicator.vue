<script setup lang="ts">
import { pathToUrl } from '@/helpers/utils'
import { PackageIcon, LeftArrowIcon } from '@icmods/assets'
import { Avatar, ButtonStyled } from '@icmods/ui'

type Instance = {
  game_version: string
  loader: string
  loader_version: string
  path: string
  install_stage: string
  icon_path?: string
  name: string
}

defineProps<{
  instance: Instance
}>()
</script>

<template>
  <div class="flex justify-between items-center border-0 border-b border-solid border-divider pb-4">
    <router-link
      :to="`/instance/${encodeURIComponent(instance.path)}`"
      tabindex="-1"
      class="flex flex-col gap-4 text-primary"
    >
      <span class="flex items-center gap-3">
        <Avatar
          :src="instance.icon_path ? pathToUrl(instance.icon_path) : undefined"
          :alt="instance.name"
          size="48px"
        />
        <span class="flex flex-col gap-1">
          <span class="font-extrabold bold text-contrast">
            {{ instance.name }}
          </span>
          <span class="text-secondary flex items-center gap-2 font-semibold">
            <PackageIcon class="h-5 w-5 text-secondary" />
            {{ instance.loader_version }}
          </span>
        </span>
      </span>
    </router-link>
    <ButtonStyled>
      <router-link :to="`/instance/${encodeURIComponent(instance.path)}`">
        <LeftArrowIcon /> Back to modpack
      </router-link>
    </ButtonStyled>
  </div>
</template>

<style scoped lang="scss"></style>
