import { DETAIL_PAGE_EVENTS } from '~/constants/usage-data-analytics-types'
import usageData from '~/utils/usage-data'

import VCopyLicense from '~/components/VMediaInfo/VCopyLicense.vue'

import render from '../../test-utils/render'

jest.mock('~/utils/usage-data', () => ({
  sendDetailPageEvent: jest.fn(),
}))

describe('VCopyLicense', () => {
  let options = null
  let props = null
  let context

  const copyData = {
    type: 'Bar',
    event: {
      content: 'Foo',
    },
  }

  beforeEach(() => {
    props = {
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
    options = {
      propsData: props,
    }
  })

  it('should contain the correct contents', () => {
    const wrapper = render(VCopyLicense, options)
    expect(wrapper.find('.copy-license')).toBeDefined()
  })

  it('should SEND_DETAIL_PAGE_EVENT on creator link clicked', () => {
    const wrapper = render(VCopyLicense, options)
    wrapper.vm.onCreatorLinkClicked(copyData.type, copyData.event)
    const eventData = {
      eventType: DETAIL_PAGE_EVENTS.CREATOR_CLICKED,
      resultUuid: props.media.id,
    }

    expect(usageData.sendDetailPageEvent).toHaveBeenCalledWith(
      eventData,
      context
    )
  })

  it('should SEND_DETAIL_PAGE_EVENT on source link clicked', () => {
    const wrapper = render(VCopyLicense, options)
    wrapper.vm.onSourceLinkClicked(copyData.type, copyData.event)
    const eventData = {
      eventType: DETAIL_PAGE_EVENTS.SOURCE_CLICKED,
      resultUuid: props.media.id,
    }

    expect(usageData.sendDetailPageEvent).toHaveBeenCalledWith(
      eventData,
      context
    )
  })

  it('should SEND_DETAIL_PAGE_EVENT on copy attribution', () => {
    const wrapper = render(VCopyLicense, options)
    wrapper.vm.onCopyAttribution(copyData.type, copyData.event)
    const eventData = {
      eventType: DETAIL_PAGE_EVENTS.ATTRIBUTION_CLICKED,
      resultUuid: props.media.id,
    }

    expect(usageData.sendDetailPageEvent).toHaveBeenCalledWith(
      eventData,
      context
    )
  })
})
