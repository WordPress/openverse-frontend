import FilterChecklist from '~/components/VFilters/VFilterChecklist'
import { createLocalVue } from '@vue/test-utils'
import { fireEvent, render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'

describe('FilterChecklist', () => {
  let options = {}
  let props = null
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    props = {
      options: [{ code: 'foo', name: 'bar', checked: false }],
      title: 'Foo',
      filterType: 'bar',
      disabled: false,
    }
    options = {
      localVue,
      propsData: props,
      global: {
        plugins: [createTestingPinia()],
      },
    }
  })

  it('should render correct contents', async () => {
    const { container } = render(FilterChecklist, options)
    const checkbox = screen.getByRole('checkbox', {
      checked: false,
      label: /bar/i,
    })
    expect(checkbox).toBeTruthy()
    expect(container.querySelector('svg')).not.toBeVisible()

    await fireEvent.click(checkbox)
    expect(container.querySelector('svg')).toBeVisible()
  })
})
