import { defineStore } from 'pinia'
import { reactive, toRefs } from '@nuxtjs/composition-api'

export const NAV = 'nav'

/**
 * Store information about navigation.
 */
export const useNav = defineStore(NAV, () => {
  const state = reactive({
    isEmbedded: true,
    isReferredFromCc: false,
  })
  const { isEmbedded, isReferredFromCc } = toRefs(state)

  function setIsEmbedded(isEmbedded = true) {
    state.isEmbedded = isEmbedded
  }
  function setIsReferredFromCc(isReferredFromCc = true) {
    state.isReferredFromCc = isReferredFromCc
  }
  return {
    isEmbedded,
    isReferredFromCc,
    setIsEmbedded,
    setIsReferredFromCc,
  }
})
