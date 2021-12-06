import { render, screen } from '@testing-library/vue'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import messages from '../../../../../src/locales/en.json'

const mediaQueryListMock = {
  matches: true,
  addEventListener: () => {},
  removeEventListener: () => {},
}
// eslint-disable-next-line no-unused-vars
window.matchMedia = (_) => mediaQueryListMock

describe('VFilterButton', () => {
  let options = {}
  let storeMock
  let localVue
  let appliedFilters = []
  let props = {}

  const i18n = new VueI18n({
    locale: 'en',
    localeProperties: {
      dir: 'ltr',
    },
    fallbackLocale: 'en',
    messages: { en: messages },
  })
  // mock for useMediaQuery filter to return true for any screen
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueI18n)

    storeMock = new Vuex.Store({
      modules: {
        search: {
          namespaced: true,
          getters: {
            isAnyFilterApplied: () => appliedFilters.length > 0,
            appliedFilterTags: () => appliedFilters,
          },
        },
      },
    })
    options = {
      localVue,
      propsData: props,
      mocks: {
        $nuxt: {
          context: {
            store: storeMock,
            i18n,
          },
        },
      },
    }
  })

  it('renders a button with an icon and "Filters" label if no filters are applied', () => {
    const { container } = render(VFilterButton, options)

    const button = screen.getByText('Filters')
    expect(button).toBeVisible()
    const icon = container.querySelector('svg')
    expect(icon).toBeVisible()
  })

  it('renders a button with "N Filters" label if N filters are applied', () => {
    appliedFilters = ['mockfilter1', 'mockfilter2']
    const { container } = render(VFilterButton, options)

    const button = screen.getByText('2 Filters')
    expect(button).toBeVisible()
    const icon = container.querySelector('svg')
    expect(icon).not.toBeVisible()
  })

  it('renders correct label on mobile when no filters are applied', () => {
    mediaQueryListMock.matches = false
    appliedFilters = []
    const { container } = render(VFilterButton, options)

    // Text is only visible for screen readers.
    const buttonTextLabel = screen.getByText('Filters')
    const icon = container.querySelector('svg')
    expect(buttonTextLabel).toBeInTheDocument()
    expect(buttonTextLabel).toHaveAttribute('class', 'filter-label sr-only')
    expect(icon).toBeInTheDocument()
  })

  it('renders correct label on mobile when filters are applied', () => {
    mediaQueryListMock.matches = false
    appliedFilters = ['mockfilter1', 'mockfilter2']
    const { container } = render(VFilterButton, options)

    const button = screen.getByText(/2 Filters/i)
    const icon = container.querySelector('svg')
    expect(button).toBeVisible()
    expect(icon).not.toBeVisible()
  })

  it('renders correct label on mobile when filters are applied and is scrolled', () => {
    mediaQueryListMock.matches = false
    appliedFilters = ['mockfilter1', 'mockfilter2']
    props.isHeaderScrolled = true
    const { container } = render(VFilterButton, options)

    const button = screen.getByText('2')
    const icon = container.querySelector('svg')

    expect(button).toBeVisible()
    expect(icon).not.toBeVisible()
  })
})
