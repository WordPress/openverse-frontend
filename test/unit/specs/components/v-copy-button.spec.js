import VCopyButton from '~/components/VCopyButton.vue'

import render from '../../test-utils/render'

describe('VCopyButton', () => {
  let options = null
  let props = null

  const eventData = {
    text: 'Foo',
    clearSelection: jest.fn(),
  }

  beforeEach(() => {
    props = {
      el: '#foo',
      id: 'foo',
    }
    options = { propsData: props, stubs: ['VButton'] }
  })

  xit('should render correct contents', () => {
    const wrapper = render(VCopyButton, options)
    expect(wrapper.find('button')).toBeDefined()
  })

  xit('data.success should be false by default', () => {
    const wrapper = render(VCopyButton, options)
    expect(wrapper.vm.$data.success).toBe(false)
  })

  xit('data.success should be false by default', () => {
    const wrapper = render(VCopyButton, options)
    expect(wrapper.vm.$data.success).toBe(false)
  })

  xit('should set data.success to true', () => {
    const wrapper = render(VCopyButton, options)
    wrapper.vm.onCopySuccess(eventData)
    expect(wrapper.vm.$data.success).toBe(true)
  })

  xit('should set data.success to back to false after 2s', (done) => {
    const wrapper = render(VCopyButton, options)
    wrapper.vm.onCopySuccess(eventData)
    setTimeout(() => {
      expect(wrapper.vm.$data.success).toBe(false)
      done()
    }, 2010)
  })

  xit('should call clearSelection', () => {
    const wrapper = render(VCopyButton, options)
    wrapper.vm.onCopySuccess(eventData)
    expect(eventData.clearSelection).toHaveBeenCalled()
  })

  xit('should emit copied event', () => {
    const wrapper = render(VCopyButton, options)
    wrapper.vm.onCopySuccess(eventData)
    expect(wrapper.emitted().copied).toBeTruthy()
  })

  xit('should emit copyFailed event', () => {
    const wrapper = render(VCopyButton, options)
    wrapper.vm.onCopyError(eventData)
    expect(wrapper.emitted().copyFailed).toBeTruthy()
  })
})
