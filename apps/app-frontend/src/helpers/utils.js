import { invoke, execute } from '@/composables/bridge'

export async function isDev() {
  return await invoke('is_dev')
}

export async function getOs() {
  return await invoke('plugin:utils|get_os')
}

export async function getOsVersion() {
  return await invoke('plugin:utils|get_os_version')
}

export async function getVersion() {
  return await invoke('plugin:utils|get_version')
}

export function pathToUrl(path) {
  return execute('plugin:utils|path_to_url', { path })
}

export async function checkUpdates() {
  return await invoke('plugin:utils|check_updates')
}

export async function restartApp() {
  return await invoke('restart_app')
}

export const releaseColor = (releaseType) => {
  switch (releaseType) {
    case 'release':
      return 'brand'
    case 'beta':
      return 'orange'
    case 'alpha':
      return 'red'
    default:
      return ''
  }
}
