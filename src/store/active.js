import {
  SET_ACTIVE_MEDIA_ITEM,
  PAUSE_ACTIVE_MEDIA_ITEM,
  EJECT_ACTIVE_MEDIA_ITEM,
  SET_MESSAGE,
} from '~/constants/mutation-types'
import { defineStore } from 'pinia'

/**
 * Stores information about the active media item.
 * @return {import('./types').ActiveMediaState}
 */
const state = () => ({
  type: null,
  id: null,
  status: 'ejected', // can be 'playing' or 'paused' as well
  message: null,
})

const mutations = {
  /**
   * Set the active media item.
   * @param {import('./types').ActiveMediaState} _state
   * @param {object} payload
   * @param {'image' | 'audio' | null} payload.type - the nature of the active media item
   * @param {string} payload.id - the ID of the active media item
   * @param {'ejected' | 'playing' | 'paused'} payload.status - the status of the active media item
   */
  [SET_ACTIVE_MEDIA_ITEM](_state, { type, id, status = 'playing' }) {
    _state.type = type
    _state.id = id
    _state.status = status
  },
  /**
   * Pause the active media item.
   * @param {import('./types').ActiveMediaState} _state
   */
  [PAUSE_ACTIVE_MEDIA_ITEM](_state) {
    _state.status = 'paused'
  },
  /**
   * Eject, and unset, the active media item.
   * @param {import('./types').ActiveMediaState} _state
   */
  [EJECT_ACTIVE_MEDIA_ITEM](_state) {
    _state.type = null
    _state.id = null
    _state.status = 'ejected'
  },
  [SET_MESSAGE](_state, { message }) {
    _state.message = message
  },
}

export default {
  state,
  mutations,
}

export const ACTIVE = 'active'

export const useActive = defineStore(ACTIVE, {
  state: () => ({
    /** type 'image' | 'audio' | null */
    type: null,
    /** type string | null */
    id: null,
    /** type 'ejected' | 'playing' | 'paused' */
    status: 'ejected', // 'ejected' means player is closed
    /** type string | null */
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
