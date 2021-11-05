import {
  SET_ACTIVE_MEDIA_ITEM,
  PAUSE_ACTIVE_MEDIA_ITEM,
  STOP_ACTIVE_MEDIA_ITEM,
} from '~/constants/mutation-types'

/**
 * Stores information about the active media item.
 * @return {import('./types').ActiveMediaState}
 */
const state = () => ({
  type: null,
  id: null,
  status: 'stopped', // can be 'playing' or 'paused' as well
})

const mutations = {
  /**
   * Set the active media item.
   * @param {import('./types').ActiveMediaState} _state
   * @param {object} payload
   * @param {'image' | 'audio' | null} payload.type - the nature of the active media item
   * @param {string} payload.id - the ID of the active media item
   * @param {'stopped' | 'playing' | 'paused'} payload.status - the status of the active media item
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
   * Stop, and unset, the active media item.
   * @param {import('./types').ActiveMediaState} _state
   */
  [STOP_ACTIVE_MEDIA_ITEM](_state) {
    _state.type = null
    _state.id = null
    _state.status = 'stopped'
  },
}

export default {
  state,
  mutations,
}
