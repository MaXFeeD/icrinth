<script setup lang="ts">
import { ChevronRightIcon, InfoIcon, WrenchIcon } from '@icmods/assets'
import { Avatar, TabbedModal, type TabbedModalTab } from '@icmods/ui'
import { ref } from 'vue'
import { defineMessage, useVIntl } from '@vintl/vintl'
import ModalWrapper from '@/components/ui/modal/ModalWrapper.vue'
import GeneralSettings from '@/components/ui/instance_settings/GeneralSettings.vue'
import { pathToUrl } from '@/helpers/utils'
import InstallationSettings from '@/components/ui/instance_settings/InstallationSettings.vue'
import type { InstanceSettingsTabProps } from '../../../helpers/types'

const { formatMessage } = useVIntl()

const props = defineProps<InstanceSettingsTabProps>()

const tabs: TabbedModalTab<InstanceSettingsTabProps>[] = [
  {
    name: defineMessage({
      id: 'instance.settings.tabs.general',
      defaultMessage: 'General',
    }),
    icon: InfoIcon,
    content: GeneralSettings,
  },
  {
    name: defineMessage({
      id: 'instance.settings.tabs.installation',
      defaultMessage: 'Installation',
    }),
    icon: WrenchIcon,
    content: InstallationSettings,
  },
]

const modal = ref()

function show() {
  modal.value.show()
}

defineExpose({ show })

const titleMessage = defineMessage({
  id: 'instance.settings.title',
  defaultMessage: 'Settings',
})
</script>
<template>
  <ModalWrapper ref="modal">
    <template #title>
      <span class="flex items-center gap-2 text-lg font-semibold text-primary">
        <Avatar
          :src="instance.icon_path ? await pathToUrl(instance.icon_path) : undefined"
          size="24px"
          :tint-by="props.instance.path"
        />
        {{ instance.name }} <ChevronRightIcon />
        <span class="font-extrabold text-contrast">{{ formatMessage(titleMessage) }}</span>
      </span>
    </template>

    <TabbedModal :tabs="tabs.map((tab) => ({ ...tab, props }))" />
  </ModalWrapper>
</template>
