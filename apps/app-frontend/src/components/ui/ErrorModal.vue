<script setup>
import { XIcon, HammerIcon, UpdatedIcon } from '@icmods/assets'
import { ChatIcon } from '@/assets/icons'
import { ref } from 'vue'
import { handleError } from '@/store/notifications.js'
import { handleSevereError } from '@/store/error.js'
import { cancel_directory_change } from '@/helpers/settings.js'
import { install } from '@/helpers/profile.js'
import ModalWrapper from '@/components/ui/modal/ModalWrapper.vue'

const errorModal = ref()
const error = ref()
const closable = ref(true)

const title = ref('An error occurred')
const errorType = ref('unknown')
const supportLink = ref('https://vk.me/core_engine')
const metadata = ref({})

defineExpose({
  async show(errorVal, context, canClose = true, source = null) {
    closable.value = canClose

    if (errorVal.message && errorVal.message.includes('Minecraft authentication error:')) {
      title.value = 'Unable to sign in to Minecraft'
      errorType.value = 'minecraft_auth'
      supportLink.value =
        'https://support.modrinth.com/en/articles/9038231-minecraft-sign-in-issues'

      if (
        errorVal.message.includes('existing connection was forcibly closed') ||
        errorVal.message.includes('error sending request for url')
      ) {
        metadata.value.network = true
      }
      if (errorVal.message.includes('because the target machine actively refused it')) {
        metadata.value.hostsFile = true
      }
    } else if (errorVal.message && errorVal.message.includes('Move directory error:')) {
      title.value = 'Could not change app directory'
      errorType.value = 'directory_move'
      supportLink.value = 'https://vk.me/core_engine'

      if (errorVal.message.includes('directory is not writeable')) {
        metadata.value.readOnly = true
      }

      if (errorVal.message.includes('Not enough space')) {
        metadata.value.notEnoughSpace = true
      }
    } else if (errorVal.message && errorVal.message.includes('No loader version selected for')) {
      title.value = 'No loader selected'
      errorType.value = 'no_loader_version'
      supportLink.value = 'https://vk.me/core_engine'
      metadata.value.profilePath = context.profilePath
    } else if (source === 'state_init') {
      title.value = 'Error initializing Inner Core Mod Browser'
      errorType.value = 'state_init'
      supportLink.value = 'https://vk.me/core_engine'
    } else {
      title.value = 'An error occurred'
      errorType.value = 'unknown'
      supportLink.value = 'https://vk.me/core_engine'
      metadata.value = {}
    }

    error.value = errorVal
    errorModal.value.show()
  },
})

async function cancelDirectoryChange() {
  try {
    await cancel_directory_change()
    window.location.reload()
  } catch (err) {
    handleError(err)
  }
}

function retryDirectoryChange() {
  window.location.reload()
}

const loadingRepair = ref(false)
async function repairInstance() {
  loadingRepair.value = true
  try {
    await install(metadata.value.profilePath, false)
    errorModal.value.hide()
  } catch (err) {
    handleSevereError(err)
  }
  loadingRepair.value = false
}
</script>

<template>
  <ModalWrapper ref="errorModal" :header="title" :closable="closable">
    <div class="modal-body">
      <div class="markdown-body">
        <template v-if="errorType === 'minecraft_auth'">
          <template v-if="metadata.network">
            <h3>Network issues</h3>
            <p>
              It looks like there were issues with the Inner Core Mod Browser connecting to
              Microsoft's servers. This is often the result of a poor connection, so we recommend
              trying again to see if it works. If issues continue to persist, follow the steps in
              <a
                href="https://support.modrinth.com/en/articles/9038231-minecraft-sign-in-issues#h_e71a5f805f"
              >
                our support article
              </a>
              to troubleshoot.
            </p>
          </template>
          <template v-else>
            <h3>Network issues</h3>
            <p>
              The Inner Core Mod Browser tried to connect to Microsoft / Xbox / Minecraft services,
              but the remote server rejected the connection. This may indicate that these services
              are blocked by the hosts file. Please visit
              <a
                href="https://support.modrinth.com/en/articles/9038231-minecraft-sign-in-issues#h_d694a29256"
              >
                our support article
              </a>
              for steps on how to fix the issue.
            </p>
          </template>
        </template>
        <template v-if="errorType === 'directory_move'">
          <template v-if="metadata.readOnly">
            <h3>Change directory permissions</h3>
            <p>
              It looks like the Inner Core Mod Browser is unable to write to the directory you
              selected. Please adjust the permissions of the directory and try again or cancel the
              directory change.
            </p>
          </template>
          <template v-else-if="metadata.notEnoughSpace">
            <h3>Not enough space</h3>
            <p>
              It looks like there is not enough space on the disk containing the dirctory you
              selected Please free up some space and try again or cancel the directory change.
            </p>
          </template>
          <template v-else>
            <p>
              The Inner Core Mod Browser is unable to migrate to the new directory you selected.
              Please contact support for help or cancel the directory change.
            </p>
          </template>

          <div class="cta-button">
            <button class="btn" @click="retryDirectoryChange">
              <UpdatedIcon /> Retry directory change
            </button>
            <button class="btn btn-danger" @click="cancelDirectoryChange">
              <XIcon /> Cancel directory change
            </button>
          </div>
        </template>
        <template v-else-if="errorType === 'state_init'">
          <p>
            Inner Core Mod Browser failed to load correctly. This may be because of a corrupted
            file, or because the app is missing crucial files.
          </p>
          <p>You may be able to fix it through one of the following ways:</p>
          <ul>
            <li>Ensuring you are connected to the internet, then try restarting the app.</li>
            <li>Redownloading the app.</li>
          </ul>
        </template>
        <template v-else-if="errorType === 'no_loader_version'">
          <p>The Inner Core Mod Browser failed to find the loader version for this modpack.</p>
          <p>To resolve this, you need to repair the modpack. Click the button below to do so.</p>
          <div class="cta-button">
            <button class="btn btn-primary" :disabled="loadingRepair" @click="repairInstance">
              <HammerIcon /> Repair modpack
            </button>
          </div>
        </template>
        <template v-else>
          {{ error.message ?? error }}
        </template>
        <template
          v-if="
            errorType === 'directory_move' ||
            errorType === 'minecraft_auth' ||
            errorType === 'state_init' ||
            errorType === 'no_loader_version'
          "
        >
          <hr />
          <p>
            If nothing is working and you need help, visit
            <a :href="supportLink">our support page</a>
            and start a chat using the widget in the bottom right and we will be more than happy to
            assist! Make sure to provide the following debug information to the agent:
          </p>
          <details>
            <summary>Debug information</summary>
            {{ error.message ?? error }}
          </details>
        </template>
      </div>
      <div class="input-group push-right">
        <a :href="supportLink" class="btn" @click="errorModal.hide()"><ChatIcon /> Get support</a>
        <button v-if="closable" class="btn" @click="errorModal.hide()"><XIcon /> Close</button>
      </div>
    </div>
  </ModalWrapper>
</template>

<style>
.light-mode {
  --color-orange-bg: rgba(255, 163, 71, 0.2);
}

.dark-mode,
.oled-mode {
  --color-orange-bg: rgba(224, 131, 37, 0.2);
}
</style>

<style scoped lang="scss">
.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  gap: 0.5rem;
}

.warning-banner {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--gap-lg);
  background-color: var(--color-orange-bg);
  border: 2px solid var(--color-orange);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.warning-banner__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;

  svg {
    color: var(--color-orange);
    height: 1.5rem;
    width: 1.5rem;
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.markdown-body {
  overflow: auto;
}
</style>
