import { invoke } from '@/composables/bridge'

// Get a project's config
export async function get_config(path, projectPath) {
  return await invoke('plugin:project|get_config', { path, projectPath })
}

// Get a project's config info
export async function get_config_info(path, projectPath) {
  return await invoke('plugin:project|get_config_info', { path, projectPath })
}

// Save a project's config
export async function save_config(path, projectPath, config) {
  return await invoke('plugin:project|save_config', { path, projectPath, config })
}
