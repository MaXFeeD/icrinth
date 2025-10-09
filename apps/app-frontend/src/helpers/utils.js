import { get_full_path, get_mod_full_path } from '@/helpers/profile'
import { invoke } from '@/composables/bridge'

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

export async function pathToUrl(path) {
  return await invoke('plugin:utils|path_to_url', { path })
}

export async function openPath(path) {
  return await invoke('plugin:utils|open_path', { path })
}

export async function highlightInFolder(path) {
  return await invoke('plugin:utils|highlight_in_folder', { path })
}

export async function showLauncherLogsFolder() {
  return await invoke('plugin:utils|show_launcher_logs_folder', {})
}

// Opens a profile's folder in the OS file explorer
export async function showProfileInFolder(path) {
  const fullPath = await get_full_path(path)
  return await openPath(fullPath)
}

export async function highlightModInProfile(profilePath, projectPath) {
  const fullPath = await get_mod_full_path(profilePath, projectPath)
  return await highlightInFolder(fullPath)
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
