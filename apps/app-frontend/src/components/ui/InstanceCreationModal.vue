<template>
  <ModalWrapper ref="modal" header="Create modpack">
    <div class="modal-header">
      <Chips v-model="creationType" :items="['custom', 'from file']" />
    </div>
    <hr class="card-divider" />
    <div v-if="creationType === 'custom'" class="modal-body">
      <div class="image-upload">
        <Avatar :src="display_icon" size="md" :rounded="true" />
        <div class="image-input">
          <Button @click="upload_icon()">
            <UploadIcon />
            Select icon
          </Button>
          <Button :disabled="!display_icon" @click="reset_icon">
            <XIcon />
            Remove icon
          </Button>
        </div>
      </div>
      <div class="input-row">
        <p class="input-label">Name</p>
        <input
          v-model="profile_name"
          autocomplete="off"
          class="text-input"
          type="text"
          maxlength="100"
        />
      </div>
      <div class="input-group push-right">
        <Button @click="hide()">
          <XIcon />
          Cancel
        </Button>
        <Button color="primary" :disabled="!check_valid || creating" @click="create_instance()">
          <PlusIcon v-if="!creating" />
          {{ creating ? 'Creating...' : 'Create' }}
        </Button>
      </div>
    </div>
    <div v-else class="modal-body">
      <Button @click="openFile"> <FolderOpenIcon /> Import from file </Button>
      <div class="info"><InfoIcon /> Or drag and drop your .mrpack file</div>
    </div>
  </ModalWrapper>
</template>

<script setup>
import ModalWrapper from '@/components/ui/modal/ModalWrapper.vue'
import { FolderOpenIcon, InfoIcon, PlusIcon, UploadIcon, XIcon } from '@icmods/assets'
import { Avatar, Button, Chips } from '@icmods/ui'
import { computed, onUnmounted, ref } from 'vue'
import { create } from '@/helpers/profile'
import { selectFile } from '@/helpers/intents'
import { pathToUrl } from '@/helpers/utils'
import { handleError } from '@/store/notifications.js'
import { trackEvent } from '@/helpers/analytics'
import { create_profile_and_install_from_file } from '@/helpers/pack.js'
import { drag_and_drop_listener } from '@/helpers/events'

const profile_name = ref('')
const icon = ref(null)
const display_icon = ref(null)
const creating = ref(false)
const showSnapshots = ref(false)
const creationType = ref('custom')
const isShowing = ref(false)

defineExpose({
  show: async () => {
    profile_name.value = ''
    creating.value = false
    showSnapshots.value = false
    icon.value = null
    display_icon.value = null
    isShowing.value = true
    modal.value.show()

    unlistener.value = drag_and_drop_listener(async (event) => {
      // Only if modal is showing
      if (!isShowing.value) return
      if (event.type !== 'drop') return
      if (creationType.value !== 'from file') return
      hide()
      if (event.paths && event.paths.length > 0 && event.paths[0].endsWith('.mrpack')) {
        await create_profile_and_install_from_file(event.paths[0]).catch(handleError)
        trackEvent('InstanceCreate', {
          source: 'CreationModalFileDrop',
        })
      }
    })

    trackEvent('InstanceCreateStart', { source: 'CreationModal' })
  },
})

const unlistener = ref(null)
const hide = () => {
  isShowing.value = false
  modal.value.hide()
  if (unlistener.value) {
    unlistener.value()
    unlistener.value = null
  }
}
onUnmounted(() => {
  if (unlistener.value) {
    unlistener.value()
    unlistener.value = null
  }
})

const modal = ref(null)

const check_valid = computed(() => {
  return profile_name.value.trim()
})

const create_instance = async () => {
  creating.value = true
  hide()
  creating.value = false

  await create(
    profile_name.value,
    icon.value,
  ).catch(handleError)

  trackEvent('InstanceCreate', {
    profile_name: profile_name.value,
    has_icon: !!icon.value,
    source: 'CreationModal',
  })
}

const upload_icon = async () => {
  const res = await selectFile(false, ['png', 'jpeg', 'svg', 'webp', 'gif', 'jpg'])

  icon.value = res.path ?? res

  if (!icon.value) return
  display_icon.value = pathToUrl(icon.value)
}

const reset_icon = () => {
  icon.value = null
  display_icon.value = null
}

const openFile = async () => {
  const newProject = await open({ multiple: false })
  if (!newProject) return
  hide()
  await create_profile_and_install_from_file(newProject.path ?? newProject).catch(handleError)

  trackEvent('InstanceCreate', {
    source: 'CreationModalFileOpen',
  })
}
</script>

<style lang="scss" scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  margin-top: var(--gap-lg);
}

.input-label {
  font-size: 1rem;
  font-weight: bolder;
  color: var(--color-contrast);
  margin-bottom: 0.5rem;
}

.text-input {
  width: 20rem;
}

.image-upload {
  display: flex;
  gap: 1rem;
}

.image-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.warning {
  font-style: italic;
}

.versions {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

:deep(button.checkbox) {
  border: none;
}

.selector {
  max-width: 20rem;
}

.labeled-divider {
  text-align: center;
}

.labeled-divider:after {
  background-color: var(--color-raised-bg);
  content: 'Or';
  color: var(--color-base);
  padding: var(--gap-sm);
  position: relative;
  top: -0.5rem;
}

.info {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
}

.path-selection {
  padding: var(--gap-xl);
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);

  h3 {
    margin: 0;
  }

  .path-input {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: row;
    gap: var(--gap-sm);

    .iconified-input {
      flex-grow: 1;
      :deep(input) {
        width: 100%;
        flex-basis: auto;
      }
    }
  }
}

.table {
  border: 1px solid var(--color-bg);
}

.table-row {
  grid-template-columns: min-content auto;
}

.table-content {
  max-height: calc(5 * (18px + 2rem));
  height: calc(5 * (18px + 2rem));
  overflow-y: auto;
}

.select-checkbox {
  button.checkbox {
    border: none;
  }
}

.button-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-md);

  .transparent {
    padding: var(--gap-sm) 0;
  }
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bolder;
  color: var(--color-contrast);
}

.card-divider {
  margin: var(--gap-md) var(--gap-lg) 0 var(--gap-lg);
}
</style>
