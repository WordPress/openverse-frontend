import { FETCH_MEDIA_PROVIDERS } from '~/constants/action-types'
import { IMAGE } from '~/constants/media'
import { PROVIDER } from '~/constants/store-modules'

export const state = () => ({
  searchType: IMAGE,
})

export const actions = {
  async nuxtServerInit({ dispatch }) {
    try {
      await dispatch(`${PROVIDER}/${FETCH_MEDIA_PROVIDERS}`)
    } catch (error) {
      console.error("Couldn't fetch media providers")
    }
  },
}
