import { invoke } from '@/composables/bridge'

export async function open_url(url) {
  return await invoke('plugin:intents|open_url', { url })
}
