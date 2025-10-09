import { ofetch } from 'ofetch'
import { handleError } from '@/store/state.js'
import { getVersion } from '@/helpers/utils'

export const useFetch = async (url, item, isSilent) => {
  try {
    const version = await getVersion()

    return await ofetch(url, {
      headers: { 'User-Agent': `icmods/theseus/${version} (support@inner-core.org)` },
    })
  } catch (err) {
    if (!isSilent) {
      handleError({ message: `Error fetching ${item}` })
    }
    console.error(err)
  }
}
