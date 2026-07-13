<script setup lang="ts">
import {
  TransferIcon,
  IssuesIcon,
  HammerIcon,
  DownloadIcon,
  WrenchIcon,
  SpinnerIcon,
  UnplugIcon,
  UnlinkIcon,
} from '@icmods/assets'
import { Avatar, ButtonStyled } from '@icmods/ui'
import { computed, type Ref, ref } from 'vue'
import { edit, install, update_repair_modrinth } from '@/helpers/profile'
import { handleError } from '@/store/notifications'
import { trackEvent } from '@/helpers/analytics'
import { defineMessages, useVIntl } from '@vintl/vintl'
import { get_loaders } from '@/helpers/tags'
import {
  formatCategory,
  type PlatformTag,
  type Project,
  type Version,
} from '@icmods/utils'
import ConfirmModalWrapper from '@/components/ui/modal/ConfirmModalWrapper.vue'
import { get_project, get_version_many } from '@/helpers/cache'
import ModpackVersionModal from '@/components/ui/ModpackVersionModal.vue'
import dayjs from 'dayjs'
import type {
  InstanceSettingsTabProps,
} from '../../../helpers/types'

const { formatMessage } = useVIntl()

const repairConfirmModal = ref()
const modpackVersionModal = ref()
const modalConfirmUnpair = ref()
const modalConfirmReinstall = ref()

const props = defineProps<InstanceSettingsTabProps>()

const [loaders] = await Promise.all([
  get_loaders()
    .then((value: PlatformTag[]) =>
      value
        // .filter((item) => item.supported_project_types.includes('modpack') || item.name === 'vanilla')
        .sort((a, b) => (a.name === 'vanilla' ? -1 : b.name === 'vanilla' ? 1 : 0)),
    )
    .then((loader: PlatformTag[]) => ref(loader))
    .catch(handleError),
])

const modpackProject: Ref<Project | null> = ref(null)
const modpackVersion: Ref<Version | null> = ref(null)
const modpackVersions: Ref<Version[] | null> = ref(null)
const fetching = ref(true)

if (props.instance.linked_data && props.instance.linked_data.project_id && !props.offline) {
  get_project(props.instance.linked_data.project_id, 'must_revalidate')
    .then((project) => {
      modpackProject.value = project

      if (project && project.versions) {
        get_version_many(project.versions, 'must_revalidate')
          .then((versions: Version[]) => {
            modpackVersions.value = versions.sort((a, b) =>
              dayjs(b.date_published).diff(dayjs(a.date_published)),
            )
            modpackVersion.value =
              versions.find(
                (version: Version) => version.id === props.instance.linked_data?.version_id,
              ) ?? null
          })
          .catch(handleError)
          .finally(() => {
            fetching.value = false
          })
      }
    })
    .catch((err) => {
      handleError(err)
      fetching.value = false
    })
} else {
  fetching.value = false
}

const currentLoaderIcon = computed(
  () => loaders?.value.find((x) => x.name === props.instance.loader)?.icon,
)

const installing = computed(() => props.instance.install_stage !== 'installed')
const repairing = ref(false)
const reinstalling = ref(false)
const changingVersion = ref(false)

async function repairProfile(force: boolean) {
  if (force) {
    repairing.value = true
  }
  await install(props.instance.path, force).catch(handleError)
  if (force) {
    repairing.value = false
  }

  trackEvent('InstanceRepair', {
    loader: props.instance.loader,
    game_version: props.instance.game_version,
  })
}

async function unpairProfile() {
  await edit(props.instance.path, {
    linked_data: null,
  })
  modpackProject.value = null
  modpackVersion.value = null
  modpackVersions.value = null
  modalConfirmUnpair.value.hide()
}

async function repairModpack() {
  reinstalling.value = true
  await update_repair_modrinth(props.instance.path).catch(handleError)
  reinstalling.value = false

  trackEvent('InstanceRepair', {
    loader: props.instance.loader,
    game_version: props.instance.game_version,
  })
}

const messages = defineMessages({
  cannotWhileInstalling: {
    id: 'instance.settings.tabs.installation.tooltip.cannot-while-installing',
    defaultMessage: 'Cannot {action} while installing',
  },
  cannotWhileOffline: {
    id: 'instance.settings.tabs.installation.tooltip.cannot-while-offline',
    defaultMessage: 'Cannot {action} while offline',
  },
  cannotWhileRepairing: {
    id: 'instance.settings.tabs.installation.tooltip.cannot-while-repairing',
    defaultMessage: 'Cannot {action} while repairing',
  },
  currentlyInstalled: {
    id: 'instance.settings.tabs.installation.currently-installed',
    defaultMessage: 'Currently installed',
  },
  unknownVersion: {
    id: 'instance.settings.tabs.installation.unknown-version',
    defaultMessage: '(unknown version)',
  },
  repairConfirmTitle: {
    id: 'instance.settings.tabs.installation.repair.confirm.title',
    defaultMessage: 'Repair modpack?',
  },
  repairConfirmDescription: {
    id: 'instance.settings.tabs.installation.repair.confirm.description',
    defaultMessage:
      'Repairing reinstalls Minecraft dependencies and checks for corruption. This may resolve issues if your game is not launching due to launcher-related errors, but will not resolve issues or crashes related to installed mods.',
  },
  repairButton: {
    id: 'instance.settings.tabs.installation.repair.button',
    defaultMessage: 'Repair',
  },
  repairingButton: {
    id: 'instance.settings.tabs.installation.repair.button.repairing',
    defaultMessage: 'Repairing',
  },
  repairInProgress: {
    id: 'instance.settings.tabs.installation.repair.in-progress',
    defaultMessage: 'Repair in progress',
  },
  repairAction: {
    id: 'instance.settings.tabs.installation.tooltip.action.repair',
    defaultMessage: 'repair',
  },
  changeVersionCannotWhileFetching: {
    id: 'instance.settings.tabs.installation.change-version.cannot-while-fetching',
    defaultMessage: 'Fetching modpack versions',
  },
  changeVersionButton: {
    id: 'instance.settings.tabs.installation.change-version.button',
    defaultMessage: 'Change version',
  },
  changeVersionAction: {
    id: 'instance.settings.tabs.installation.tooltip.action.change-version',
    defaultMessage: 'change version',
  },
  installingButton: {
    id: 'instance.settings.tabs.installation.change-version.button.installing',
    defaultMessage: 'Installing',
  },
  installingNewVersion: {
    id: 'instance.settings.tabs.installation.change-version.in-progress',
    defaultMessage: 'Installing new version',
  },
  minecraftVersion: {
    id: 'instance.settings.tabs.installation.minecraft-version',
    defaultMessage: 'Minecraft {version}',
  },
  noConnection: {
    id: 'instance.settings.tabs.installation.no-connection',
    defaultMessage: 'Cannot fetch linked modpack details. Please check your internet connection.',
  },
  noModpackFound: {
    id: 'instance.settings.tabs.installation.no-modpack-found',
    defaultMessage:
      'This modpack is linked to remote, but the modpack could not be found on Inner Core Mods.',
  },
  debugInformation: {
    id: 'instance.settings.tabs.installation.debug-information',
    defaultMessage: 'Debug information:',
  },
  fetchingModpackDetails: {
    id: 'instance.settings.tabs.installation.fetching-modpack-details',
    defaultMessage: 'Fetching modpack details',
  },
  unlinkInstanceTitle: {
    id: 'instance.settings.tabs.installation.unlink.title',
    defaultMessage: 'Unlink from modpack',
  },
  unlinkInstanceDescription: {
    id: 'instance.settings.tabs.installation.unlink.description',
    defaultMessage: `This modpack is linked to remote, which means mods can't be updated. Unlinking will permanently disconnect this modpack.`,
  },
  unlinkInstanceButton: {
    id: 'instance.settings.tabs.installation.unlink.button',
    defaultMessage: 'Unlink modpack',
  },
  unlinkInstanceConfirmTitle: {
    id: 'instance.settings.tabs.installation.unlink.confirm.title',
    defaultMessage: 'Are you sure you want to unlink this modpack?',
  },
  unlinkInstanceConfirmDescription: {
    id: 'instance.settings.tabs.installation.unlink.confirm.description',
    defaultMessage:
      'If you proceed, you will not be able to re-link it without creating an entirely new modpack. You will no longer receive modpack updates and it will become a normal.',
  },
  reinstallModpackConfirmTitle: {
    id: 'instance.settings.tabs.installation.reinstall.confirm.title',
    defaultMessage: 'Are you sure you want to reinstall this modpack?',
  },
  reinstallModpackConfirmDescription: {
    id: 'instance.settings.tabs.installation.reinstall.confirm.description',
    defaultMessage: `Reinstalling will reset all installed or modified content to what is provided by the modpack, removing any mods or content you have added on top of the original installation. This may fix unexpected behavior if changes have been made to the modpack, but if your worlds now depend on additional installed content, it may break existing worlds.`,
  },
  reinstallModpackTitle: {
    id: 'instance.settings.tabs.installation.reinstall.title',
    defaultMessage: 'Reinstall modpack',
  },
  reinstallModpackDescription: {
    id: 'instance.settings.tabs.installation.reinstall.description',
    defaultMessage: `Resets the modpack's content to its original state, removing any mods or content you have added on top of the original modpack.`,
  },
  reinstallModpackButton: {
    id: 'instance.settings.tabs.installation.reinstall.button',
    defaultMessage: 'Reinstall modpack',
  },
  reinstallingModpackButton: {
    id: 'instance.settings.tabs.installation.reinstall.button.reinstalling',
    defaultMessage: 'Reinstalling modpack',
  },
  reinstallAction: {
    id: 'instance.settings.tabs.installation.tooltip.action.reinstall',
    defaultMessage: 'reinstall',
  },
})
</script>

<template>
  <ConfirmModalWrapper
    ref="repairConfirmModal"
    :title="formatMessage(messages.repairConfirmTitle)"
    :description="formatMessage(messages.repairConfirmDescription)"
    :proceed-icon="HammerIcon"
    :proceed-label="formatMessage(messages.repairButton)"
    :danger="false"
    :show-ad-on-close="false"
    @proceed="() => repairProfile(true)"
  />
  <ModpackVersionModal
    v-if="instance.linked_data && modpackVersions"
    ref="modpackVersionModal"
    :instance="instance"
    :versions="modpackVersions"
    @finish-install="
      () => {
        changingVersion = false
        modpackVersion =
          modpackVersions?.find(
            (version: Version) => version.id === props.instance.linked_data?.version_id,
          ) ?? null
      }
    "
  />
  <ConfirmModalWrapper
    ref="modalConfirmUnpair"
    :title="formatMessage(messages.unlinkInstanceConfirmTitle)"
    :description="formatMessage(messages.unlinkInstanceConfirmDescription)"
    :proceed-icon="UnlinkIcon"
    :proceed-label="formatMessage(messages.unlinkInstanceButton)"
    :show-ad-on-close="false"
    @proceed="() => unpairProfile()"
  />
  <ConfirmModalWrapper
    ref="modalConfirmReinstall"
    :title="formatMessage(messages.reinstallModpackConfirmTitle)"
    :description="formatMessage(messages.reinstallModpackConfirmDescription)"
    :proceed-icon="DownloadIcon"
    :proceed-label="formatMessage(messages.reinstallModpackButton)"
    :show-ad-on-close="false"
    @proceed="() => repairModpack()"
  />
  <div>
    <h2 id="project-name" class="m-0 mb-1 text-lg font-extrabold text-contrast block">
      {{ formatMessage(messages.currentlyInstalled) }}
    </h2>
    <div
      v-if="!modpackProject && instance.linked_data && offline && !fetching"
      class="text-secondary font-medium mb-2"
    >
      <UnplugIcon class="top-[3px] relative" /> {{ formatMessage(messages.noConnection) }}
    </div>
    <div v-else-if="!modpackProject && instance.linked_data && !fetching" class="mb-2">
      <p class="text-brand-red font-medium mt-0">
        <IssuesIcon class="top-[3px] relative" /> {{ formatMessage(messages.noModpackFound) }}
      </p>
      <p>{{ formatMessage(messages.debugInformation) }}</p>
      <div class="bg-bg p-6 rounded-2xl mt-2 text-sm text-secondary">
        {{ instance.linked_data }}
      </div>
    </div>
    <div class="flex gap-4 items-center justify-between p-4 bg-bg rounded-2xl">
      <div v-if="fetching" class="flex items-center gap-2 h-10">
        <SpinnerIcon class="animate-spin" />
        {{ formatMessage(messages.fetchingModpackDetails) }}
      </div>
      <template v-else>
        <div class="flex gap-2 items-center">
          <Avatar v-if="modpackProject" :src="modpackProject?.icon_url" size="40px" />
          <div
            v-else
            class="w-10 h-10 flex items-center justify-center rounded-full bg-button-bg border-solid border-[1px] border-button-border p-2 [&_svg]:h-full [&_svg]:w-full"
          >
            <div v-if="!!currentLoaderIcon" class="contents" v-html="currentLoaderIcon" />
            <WrenchIcon v-else />
          </div>
          <div class="flex flex-col gap-2 justify-center">
            <span class="font-semibold leading-none">
              {{
                modpackProject
                  ? modpackProject.title
                  : formatMessage(messages.minecraftVersion, { version: instance.game_version })
              }}
            </span>
            <span class="text-sm text-secondary leading-none">
              {{
                modpackProject
                  ? modpackVersion
                    ? modpackVersion?.version_number
                    : 'Unknown version'
                  : formatCategory(instance.loader)
              }}
              <template v-if="instance.loader !== 'vanilla' && !modpackProject">
                {{ instance.loader_version || formatMessage(messages.unknownVersion) }}
              </template>
            </span>
          </div>
        </div>
        <div class="flex gap-1">
          <ButtonStyled color="orange" type="transparent" hover-color-fill="background">
            <button
              v-tooltip="
                repairing
                  ? formatMessage(messages.repairInProgress)
                  : installing || reinstalling
                    ? formatMessage(messages.cannotWhileInstalling, {
                        action: formatMessage(messages.repairAction),
                      })
                    : offline
                      ? formatMessage(messages.cannotWhileOffline, {
                          action: formatMessage(messages.repairAction),
                        })
                      : null
              "
              :disabled="installing || repairing || reinstalling || offline"
              @click="repairConfirmModal.show()"
            >
              <SpinnerIcon v-if="repairing" class="animate-spin" />
              <HammerIcon v-else />
              {{
                repairing
                  ? formatMessage(messages.repairingButton)
                  : formatMessage(messages.repairButton)
              }}
            </button>
          </ButtonStyled>
          <ButtonStyled v-if="modpackProject" hover-color-fill="background">
            <button
              v-tooltip="
                changingVersion
                  ? formatMessage(messages.installingNewVersion)
                  : repairing
                    ? formatMessage(messages.cannotWhileRepairing, {
                        action: formatMessage(messages.changeVersionAction),
                      })
                    : installing || reinstalling
                      ? formatMessage(messages.cannotWhileInstalling, {
                          action: formatMessage(messages.changeVersionAction),
                        })
                      : fetching && !modpackVersions
                        ? formatMessage(messages.changeVersionCannotWhileFetching)
                        : offline
                          ? formatMessage(messages.cannotWhileOffline, {
                              action: formatMessage(messages.changeVersionAction),
                            })
                          : null
              "
              :disabled="
                changingVersion ||
                repairing ||
                installing ||
                reinstalling ||
                offline ||
                fetching ||
                !modpackVersions
              "
              @click="
                () => {
                  changingVersion = true
                  modpackVersionModal.show()
                }
              "
            >
              <SpinnerIcon v-if="changingVersion" class="animate-spin" />
              <TransferIcon v-else />
              {{
                changingVersion
                  ? formatMessage(messages.installingButton)
                  : formatMessage(messages.changeVersionButton)
              }}
            </button>
          </ButtonStyled>
        </div>
      </template>
    </div>
    <template v-if="instance.linked_data && instance.linked_data.locked">
      <h2 class="mt-4 mb-1 text-lg font-extrabold text-contrast block">
        {{ formatMessage(messages.unlinkInstanceTitle) }}
      </h2>
      <p class="m-0">
        {{ formatMessage(messages.unlinkInstanceDescription) }}
      </p>
      <ButtonStyled>
        <button class="mt-2" @click="modalConfirmUnpair.show()">
          <UnlinkIcon /> {{ formatMessage(messages.unlinkInstanceButton) }}
        </button>
      </ButtonStyled>
      <template v-if="modpackProject">
        <div>
          <h2 class="m-0 mb-1 text-lg font-extrabold text-contrast block mt-4">
            {{ formatMessage(messages.reinstallModpackTitle) }}
          </h2>
          <p class="m-0">
            {{ formatMessage(messages.reinstallModpackDescription) }}
          </p>
        </div>
        <ButtonStyled color="red" type="outlined">
          <button
            v-tooltip="
              reinstalling
                ? formatMessage(messages.reinstallingModpackButton)
                : repairing
                  ? formatMessage(messages.cannotWhileRepairing, {
                      action: formatMessage(messages.reinstallAction),
                    })
                  : installing
                    ? formatMessage(messages.cannotWhileInstalling, {
                        action: formatMessage(messages.reinstallAction),
                      })
                    : offline
                      ? formatMessage(messages.cannotWhileOffline, {
                          action: formatMessage(messages.reinstallAction),
                        })
                      : null
            "
            class="mt-2"
            :disabled="
              changingVersion ||
              repairing ||
              installing ||
              offline ||
              fetching ||
              !modpackVersions
            "
            @click="modalConfirmReinstall.show()"
          >
            <SpinnerIcon v-if="reinstalling" class="animate-spin" />
            <DownloadIcon v-else />
            {{
              reinstalling
                ? formatMessage(messages.reinstallingModpackButton)
                : formatMessage(messages.reinstallModpackButton)
            }}
          </button>
        </ButtonStyled>
      </template>
    </template>
  </div>
</template>
