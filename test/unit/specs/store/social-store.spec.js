import { SocialMediaShare } from '~/analytics/events'
import { actionsCreator } from '~/store/social'
import { SOCIAL_MEDIA_SHARE } from '~/constants/action-types'

describe('Social Media Store', () => {
  describe('actions', () => {
    let googleAnalyticsMock = null
    let gaInstance = null
    let actions = null

    beforeEach(() => {
      gaInstance = { sendEvent: jest.fn() }
      googleAnalyticsMock = jest.fn(() => gaInstance)
      actions = actionsCreator(googleAnalyticsMock)
    })

    it('SOCIAL_MEDIA_SHARE sends social media share event', () => {
      const data = {
        site: 'Facebook',
      }
      actions[SOCIAL_MEDIA_SHARE]({}, data)

      expect(googleAnalyticsMock().sendEvent).toHaveBeenCalledWith(
        new SocialMediaShare(data.site)
      )
    })
  })
})
