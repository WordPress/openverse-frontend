import { createLocalVue, mount } from '@vue/test-utils'
import { PiniaVuePlugin } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

import { DETAIL_PAGE_EVENTS } from '~/constants/usage-data-analytics-types'
import { useUsageDataStore } from '~/stores/usage-data'

import ReuseSurvey from '~/components/ImageDetails/ReuseSurvey'

jest.mock('~/utils/sentry-config.ts', () => ({
  sentryConfig: { disabled: false },
}))
describe('ReuseSurvey', () => {
  let options = null
  let props = null
  const localVue = createLocalVue()
  localVue.use(PiniaVuePlugin)

  beforeEach(() => {
    props = {
      image: { id: 0 },
    }
    options = {
      localVue,
      pinia: createTestingPinia(),
      propsData: props,
    }
  })

  it('should dispatch REUSE_SURVEY on reuse link clicked', () => {
    const usageDataStore = useUsageDataStore()
    const wrapper = mount(ReuseSurvey, options)
    wrapper.find('a').trigger('click')
    expect(usageDataStore.sendDetailPageEvent).toHaveBeenCalledWith({
      eventType: DETAIL_PAGE_EVENTS.REUSE_SURVEY,
      resultUuid: props.image.id,
    })
  })
})
