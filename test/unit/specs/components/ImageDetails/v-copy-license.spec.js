import { createLocalVue, mount } from '@vue/test-utils'
import { PiniaVuePlugin } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

import { DETAIL_PAGE_EVENTS } from '~/constants/usage-data-analytics-types'
import { useUsageDataStore } from '~/stores/usage-data'

import VCopyLicense from '~/components/VMediaInfo/VCopyLicense.vue'

const defaultProps = {
  media: {
    id: 0,
    title: 'foo',
    provider: 'flickr',
    url: 'foo.bar',
    thumbnail: 'http://foo.bar',
    foreign_landing_url: 'http://foo.bar',
    license: 'BY',
    license_version: '1.0',
    license_url: 'http://license.com',
    creator: 'John',
    creator_url: 'http://creator.com',
  },
  fullLicenseName: 'LICENSE',
}
describe('VCopyLicense', () => {
  let options = null
  let props = null
  const localVue = createLocalVue()
  localVue.use(PiniaVuePlugin)
  const copyData = {
    type: 'Bar',
    event: {
      content: 'Foo',
    },
  }

  beforeEach(() => {
    props = { ...defaultProps }
    options = {
      localVue,
      pinia: createTestingPinia(),
      propsData: props,
    }
  })

  it('should contain the correct contents', () => {
    const wrapper = mount(VCopyLicense, options)
    expect(wrapper.find('.copy-license')).toBeDefined()
  })

  it('should dispatch SEND_DETAIL_PAGE_EVENT on copy attribution', () => {
    const usageDataStore = useUsageDataStore()
    const wrapper = mount(VCopyLicense, options)
    wrapper.vm.onCopyAttribution(copyData.type, copyData.event)
    expect(usageDataStore.sendDetailPageEvent).toHaveBeenCalledWith({
      eventType: DETAIL_PAGE_EVENTS.ATTRIBUTION_CLICKED,
      resultUuid: props.media.id,
    })
  })
})
