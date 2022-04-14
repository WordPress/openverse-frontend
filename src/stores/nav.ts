import { defineStore } from 'pinia'

export interface NavState {
  isEmbedded: boolean
  isReferredFromCc: boolean
}

/**
 * Store information about navigation.
 */
export const useNavStore = defineStore('nav', {
  state: (): NavState => ({
    isEmbedded: true,
    isReferredFromCc: false,
  }),

  /* Actions */
  actions: {
    setIsEmbedded(isEmbedded = true) {
      this.isEmbedded = isEmbedded
    },
    setIsReferredFromCc(isReferredFromCc = true) {
      this.isReferredFromCc = isReferredFromCc
    },
  },
})
