import { defineStore } from 'pinia'

export const NAV = 'nav'

/**
 * Store information about navigation.
 */
export const useNav = defineStore(NAV, {
  state: () => ({
    isEmbedded: true,
    isReferredFromCc: false,
  }),
})
