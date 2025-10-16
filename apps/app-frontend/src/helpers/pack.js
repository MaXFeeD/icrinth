/**
 * All theseus API calls return serialized values (both return values and errors);
 * So, for example, addDefaultInstance creates a blank Profile object, where the Rust struct is serialized,
 *  and deserialized into a usable JS object.
 */
import { invoke } from '@/composables/bridge'

// Installs pack from a version ID
export async function create_profile_and_install(projectId, versionId, title, iconUrl) {
  return await invoke('plugin:modpack|install_from_version', {
    projectId,
    versionId,
    title,
    iconUrl,
  })
}

export async function install_to_existing_profile(projectId, versionId, title, profilePath) {
  return await invoke('plugin:modpack|install_from_version', {
    path: profilePath,
    projectId,
    versionId,
    title,
  })
}

// Installs pack from a path
export async function create_profile_and_install_from_file(archive) {
  return await invoke('plugin:modpack|install_from_path', { archive })
}
