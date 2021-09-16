import HeaderSection from '~/components/HeaderSection'
import render from '../../test-utils/render'

describe('HeaderSection', () => {
  it('should render correct contents', () => {
    const wrapper = render(HeaderSection, {
      stubs: { EmbeddedNavSection: true, NotificationBanner: true },
      mocks: {
        $store: {
          state: {
            abSessionId: '',
            nav: { isEmbedded: true },
            notification: { showNotification: true },
          },
        },
        $route: {
          path: '',
        },
      },
    })

    expect(wrapper.find('header').vm).toBeDefined()
  })
})
