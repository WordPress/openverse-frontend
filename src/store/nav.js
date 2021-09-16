import { SET_EMBEDDED } from '~/constants/mutation-types'

export const state = () => ({
  isEmbedded: true,
})

export const mutations = {
  [SET_EMBEDDED](_state, params) {
    _state.isEmbedded = params.isEmbedded
  },
}
