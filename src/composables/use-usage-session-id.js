import { ssrRef } from '@nuxtjs/composition-api'
import { v4 as uuidv4 } from 'uuid'

/**
 * Sets the usageSessionId as a per-request ssrRef. The value is created on the server
 * in one of the layout components, and is saved to the store to be used when outside
 * the component context.
 *
 * @param store
 * @returns {{usageSessionId: string}}
 */
export function useUsageSessionId(store) {
  let usageSessionId = ssrRef('')
  if (!store.state.media.usageSessionId) {
    if (process.server) {
      usageSessionId.value = uuidv4()
    }
    store.commit('media/SET_USAGE_SESSION_ID', usageSessionId.value)
  }
  return { usageSessionId: usageSessionId.value }
}
