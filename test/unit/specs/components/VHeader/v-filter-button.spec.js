import { render, screen } from '@testing-library/vue'
import { createLocalVue } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import { ref } from '@nuxtjs/composition-api'

import { createPinia, PiniaVuePlugin } from 'pinia'

import messages from '~/locales/en.json'
import { useFilterStore } from '~/stores/filter'
import { IMAGE } from '~/constants/media'
import { filterData, mediaFilterKeys } from '~/constants/filters'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'

function applyNFilters(filterCount, filterStore) {
  const filterTypes = mediaFilterKeys[IMAGE]
  let filterIdx = 0
  let filterTypeIdx = 0
  for (let i = 0; i < filterCount; i++) {
    filterStore.toggleFilter({
      filterType: filterTypes[filterTypeIdx],
      codeIdx: filterIdx,
    })
    filterIdx += 1
    if (filterData[filterTypes[filterTypeIdx]].length === filterIdx) {
      filterTypeIdx += 1
      filterIdx = 0
    }
  }
}

describe('VFilterButton', () => {
  let options = {}
  let localVue
  let props = {}
  let provided = {
    isMinScreenMd: ref(true),
    isHeaderScrolled: ref(false),
  }
  let pinia
  let filterStore

  const i18n = new VueI18n({
    locale: 'en',
    localeProperties: { dir: 'ltr' },
    fallbackLocale: 'en',
    messages: { en: messages },
  })
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(PiniaVuePlugin)
    pinia = createPinia()
    filterStore = useFilterStore(pinia)

    options = {
      localVue,
      propsData: props,
      mocks: { $nuxt: { context: { i18n } } },
      provide: provided,
      pinia,
    }
  })

  describe('Above the medium breakpoint', () => {
    it('always shows the label and icon', () => {
      provided.isMinScreenMd.value = true
      const { container } = render(VFilterButton, options)

      const button = screen.getByText('Filters')
      const icon = container.querySelector('svg')

      expect(button).toBeVisible()
      expect(icon).toBeVisible()
    })
    it('shows the count and text when filters are applied', () => {
      provided.isMinScreenMd.value = true
      // +2 to guarantee it's plural
      const filterCount = Math.floor(Math.random() * 9) + 2
      applyNFilters(filterCount, filterStore)
      const wrapper = render(VFilterButton, options)
      const button = wrapper.getByText(`${filterCount} Filters`)

      expect(button).toBeVisible()
    })
    it('does not show the icon when filters are applied', () => {
      provided.isMinScreenMd.value = true
      filterStore.toggleFilter({ filterType: 'licenses', codeIdx: 0 })

      const { container } = render(VFilterButton, options)
      const icon = container.querySelector('svg')

      expect(icon).not.toBeVisible()
    })
  })

  describe('below the medium breakpoint', () => {
    it('only shows the filter icon by default', () => {
      provided.isMinScreenMd.value = false
      const { container } = render(VFilterButton, options)

      const icon = container.querySelector('svg')
      const label = screen.queryByTestId('filterbutton-label')

      expect(icon).toBeVisible()
      expect(label).not.toBeVisible()
    })
    it('only shows the count and label when filters are applied', () => {
      provided.isMinScreenMd.value = false
      // +2 to guarantee it's plural
      const filterCount = Math.floor(Math.random() * 9) + 2
      applyNFilters(filterCount, filterStore)
      const { container } = render(VFilterButton, options)

      const icon = container.querySelector('svg')
      const button = screen.getByText(`${filterCount} Filters`)

      expect(icon).not.toBeVisible()
      expect(button).toBeVisible()
    })
    it('only shows the count when filters are applied and the user scrolls', () => {
      provided.isMinScreenMd.value = false
      provided.isHeaderScrolled.value = true
      // +2 to guarantee it's plural
      const filterCount = Math.floor(Math.random() * 10) + 2
      applyNFilters(filterCount, filterStore)
      const { container } = render(VFilterButton, options)

      const icon = container.querySelector('svg')
      const button = screen.getByText(filterCount)

      expect(icon).not.toBeVisible()
      expect(button).toBeVisible()
    })
  })
})
