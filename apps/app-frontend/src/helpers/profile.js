/**
 * All theseus API calls return serialized values (both return values and errors);
 * So, for example, addDefaultInstance creates a blank Profile object, where the Rust struct is serialized,
 *  and deserialized into a usable JS object.
 */
import { invoke } from '@/composables/bridge'
import { install_to_existing_profile } from '@/helpers/pack.js'
import { handleError } from '@/store/notifications.js'

/// Add instance
/*
    name: String,           // the name of the modpack, and relative path to create
    icon: Path,  // the icon for the modpack
    - icon is a path to an image file, which will be copied into the modpack directory
*/

// eslint-disable-next-line no-unused-vars
export async function create(title, iconPath, skipInstall) {
  // Trim string title to avoid "Unable to find directory"
  title = title.trim()
  return await invoke('plugin:modpack|create', {
    title,
    iconPath,
  })
}

// Duplicate a modpack
export async function duplicate(path) {
  return await invoke('plugin:modpack|duplicate', { path })
}

// Remove a modpack
export async function remove(path) {
  return await invoke('plugin:modpack|remove', { path })
}

// Get a modpack by path
// Returns a Profile
export async function get(path) {
  return await invoke('plugin:modpack|get', { path })
}

export async function get_many(paths) {
  return await invoke('plugin:modpack|get_many', { paths })
}

// Get a modpack's projects
// Returns a map of a path to modpack file
export async function get_projects(path, cacheBehaviour) {
  return await invoke('plugin:modpack|get_projects', { path, cacheBehaviour })
}

// Get a modpack's full fs path
// Returns a path
export async function get_full_path(path) {
  return await invoke('plugin:modpack|get_full_path', { path })
}

// Get's a mod's full fs path
// Returns a path
export async function get_mod_full_path(path, projectPath) {
  return await invoke('plugin:modpack|get_project_full_path', { path, projectPath })
}

// Get a copy of the modpack set
// Returns hashmap of path -> Profile
export async function list() {
  return await invoke('plugin:modpack|list')
}

export async function check_installed(path, projectId) {
  return await invoke('plugin:modpack|check_installed', { path, projectId })
}

// Installs/Repairs a modpack
export async function install(path, force) {
  return await invoke('plugin:modpack|install', { path, force })
}

// Updates all of a modpack's projects
export async function update_all(path) {
  return await invoke('plugin:modpack|update_all', { path })
}

// Updates a specified project
export async function update_project(path, projectPath) {
  return await invoke('plugin:modpack|update_project', { path, projectPath })
}

// Add a project to a modpack from a version
// Returns a path to the new project file
export async function add_project_from_version(path, versionId) {
  return await invoke('plugin:modpack|add_project_from_version', { path, versionId })
}

// Add a project to a modpack from a path + project_type
// Returns a path to the new project file
export async function add_project_from_path(path, projectPath, projectType) {
  return await invoke('plugin:modpack|add_project_from_path', {
    path,
    projectPath,
    projectType,
  })
}

// Toggle disabling a project
export async function toggle_disable_project(path, projectPath) {
  return await invoke('plugin:modpack|toggle_disable_project', { path, projectPath })
}

// Remove a project
export async function remove_project(path, projectPath) {
  return await invoke('plugin:modpack|remove_project', { path, projectPath })
}

// Update a managed Modrinth modpack to a specific version
export async function update_managed_modrinth_version(path, versionId) {
  return await invoke('plugin:modpack|update_remote_managed_version', { path, versionId })
}

// Repair a managed Modrinth modpack
export async function update_repair_modrinth(path) {
  return await invoke('plugin:modpack|repair_remote_managed', { path })
}

// Export a modpack to .mrpack
/// included_overrides is an array of paths to override folders to include (ie: 'mods', 'resource_packs')
// Version id is optional (ie: 1.1.5)
export async function export_profile_mrpack(
  path,
  exportLocation,
  includedOverrides,
  versionId,
  description,
  name,
) {
  return await invoke('plugin:modpack|export_as_archive', {
    path,
    exportLocation,
    includedOverrides,
    versionId,
    description,
    name,
  })
}

// Given a folder path, populate an array of all the subfolders
// Intended to be used for finding potential override folders
// modpack
// -- mods
// -- resourcepacks
// -- file1
// => [mods, resourcepacks]
// allows selection for 'included_overrides' in export_profile_mrpack
export async function get_pack_export_candidates(path) {
  return await invoke('plugin:modpack|get_export_candidates', { path })
}

// Run Minecraft using a pathed modpack
// Returns PID of child
export async function run(path) {
  return await invoke('plugin:modpack|launch', { path })
}

export async function kill(path) {
  return await invoke('plugin:modpack|interrupt', { path })
}

// Edits a modpack
export async function edit(path, editProfile) {
  return await invoke('plugin:modpack|edit', { path, editProfile })
}

// Edits a modpack's icon
export async function edit_icon(path, iconPath) {
  return await invoke('plugin:modpack|edit_icon', { path, iconPath })
}

export async function finish_install(instance) {
  if (instance.install_stage !== 'pack_installed') {
    let linkedData = instance.linked_data
    await install_to_existing_profile(
      linkedData.project_id,
      linkedData.version_id,
      instance.name,
      instance.path,
    ).catch(handleError)
  } else {
    await install(instance.path, false).catch(handleError)
  }
}
