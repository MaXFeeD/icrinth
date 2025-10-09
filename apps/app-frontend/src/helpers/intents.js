import { invoke } from '@/composables/bridge'
import { get_full_path, get_mod_full_path } from '@/helpers/profile'

export async function openUrl(url) {
  return await invoke('plugin:intents|open_url', { url })
}

export async function openFolder(path) {
  return await invoke('plugin:intents|open_folder', { path })
}

export async function highlightInFolder(path) {
  return await invoke('plugin:intents|highlight_in_folder', { path })
}

export async function showLauncherLogsFolder() {
  return await invoke('plugin:intents|show_launcher_logs_folder', {})
}

// Opens a profile's folder in the OS file explorer
export async function showProfileInFolder(path) {
  const fullPath = await get_full_path(path)
  return await openFolder(fullPath)
}

export async function highlightModInProfile(profilePath, projectPath) {
  const fullPath = await get_mod_full_path(profilePath, projectPath)
  return await highlightInFolder(fullPath)
}
