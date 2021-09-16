import { SocialMediaShare } from '~/analytics/events'
import GoogleAnalytics from '~/analytics/google-analytics'
import { SOCIAL_MEDIA_SHARE } from '~/constants/action-types'

export const actionsCreator = (GoogleAnalytics) => ({
  // eslint-disable-next-line no-unused-vars
  [SOCIAL_MEDIA_SHARE]({ commit }, params) {
    const event = SocialMediaShare(params.site)
    GoogleAnalytics().sendEvent(event)
  },
})

export const actions = actionsCreator(GoogleAnalytics)

export default {
  actions,
}
