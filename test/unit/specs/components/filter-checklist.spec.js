import FilterChecklist from '~/components/Filters/FilterChecklist'
import VCheckbox from '~/components/VCheckbox'
import render from '../../test-utils/render'
import { createLocalVue } from '@vue/test-utils'

describe('FilterChecklist', () => {
  let options = {}
  let props = null
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.component('VCheckbox', VCheckbox)
    props = {
      options: [{ code: 'foo', name: 'bar', checked: false }],
      title: 'Foo',
      filterType: 'bar',
      disabled: false,
    }
    options = {
      localVue,
      propsData: props,
      mocks: {
        $store: { state: { filters: { licenses: {}, licenseTypes: {} } } },
      },
    }
  })

  it('should render correct contents', () => {
    const wrapper = render(FilterChecklist, options)
    expect(wrapper.find('.filters').vm).toBeDefined()
  })
})
