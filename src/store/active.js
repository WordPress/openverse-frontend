import { defineStore } from 'pinia'

export const ACTIVE = 'active'

/**
 * Store information about the active media item.
 */
export const useActive = defineStore(ACTIVE, {
  /** @return {import('./types').ActiveMediaState} */
  state: () => ({
    type: null,
    id: null,
    status: 'ejected', // 'ejected' means player is closed
    message: null,
  }),

  actions: {
    /**
     * @param {object} payload
     * @param {'image' | 'audio' | null} payload.type
     * @param {string | null} payload.id
     * @param {'ejected' | 'playing' | 'paused'} payload.status
     */
    setActiveMediaItem({ type, id, status }) {
      this.type = type
      this.id = id
      this.status = status
    },
    pauseActiveMediaItem() {
      this.status = 'paused'
    },
    ejectActiveMediaItem() {
      this.status = 'ejected'
      this.id = null
      this.type = null
    },
    /**
     * @param message {string}
     */
    setMessage({ message }) {
      this.message = message
    },
  },
})
