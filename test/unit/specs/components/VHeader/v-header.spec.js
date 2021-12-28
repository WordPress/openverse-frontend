import { render, screen } from '@testing-library/vue'

import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import messages from '../../../../../src/locales/en.json'

import VHeader from '~/components/VHeader/VHeader.vue'
import {
  useMatchHomeRoute,
  useMatchSearchRoutes,
} from '~/composables/use-match-routes'
import { isMinScreen, useReducedMotion } from '@/composables/use-media-query'
import { ref } from '@nuxtjs/composition-api'
/**
 * For some reason I need to mock the implementation
 * of this mock in each test, or it doesn't work.
 *
 * In each implementation I'm faking returning a ref
 * with `mockImplementation(() => ({value: true}))`
 * that may be related.
 */
jest.mock('~/composables/use-match-routes', () => ({
  useMatchSearchRoutes: jest.fn(),
  useMatchHomeRoute: jest.fn(),
}))
jest.mock('~/composables/use-media-query', () => ({
  isMinScreen: jest.fn(),
  useReducedMotion: jest.fn(),
}))

describe('VHeader', () => {
  let options = {}
  let storeMock
  let localVue
  let appliedFilters = []
  let props = {}
  let provided = {
    isHeaderScrolled: ref(false),
  }

  const i18n = new VueI18n({
    locale: 'en',
    localeProperties: {
      dir: 'ltr',
    },
    fallbackLocale: 'en',
    messages: { en: messages },
  })
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueI18n)
    storeMock = new Vuex.Store({
      modules: {
        media: {
          namespaced: true,
          getters: {
            results: () => ({ count: 2 }),
            fetchState: () => ({
              isFetching: false,
            }),
          },
        },
        search: {
          namespaced: true,
          state: {
            searchType: 'image',
            query: { q: 'cat', mediaType: 'image' },
          },
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
        $nuxt: { context: { store: storeMock, i18n } },
      },
      stubs: { NuxtLink: true },
      provide: provided,
    }
  })
  describe('Non-search header', () => {
    it('shows logo', () => {
      useMatchSearchRoutes.mockImplementation(() => ({ matches: ref(false) }))
      useMatchHomeRoute.mockImplementation(() => ({ matches: ref(true) }))

      isMinScreen.mockImplementation(() => ref(true))

      render(VHeader, options)

      const logo = screen.getByTestId('logo-loader')

      expect(logo).toBeVisible()
    })
    it('animates the logo when fetching', () => {
      useMatchSearchRoutes.mockImplementation(() => ({ matches: ref(false) }))
      useMatchHomeRoute.mockImplementation(() => ({ matches: ref(true) }))
      isMinScreen.mockImplementation(() => ref(true))

      // todo: mock isFetching: true

      render(VHeader, options)

      const logo = screen.getByTestId('logo-loader')
      // todo: test logo is animating
      expect(logo).toBeVisible()
    })
  })
  describe('Search header', () => {
    describe('Above the medium breakpoint', () => {
      it('shows page menu', async () => {
        useMatchSearchRoutes.mockImplementation(() => ({ matches: ref(true) }))
        useMatchHomeRoute.mockImplementation(() => ({ matches: ref(false) }))
        isMinScreen.mockImplementation(() => ref(true))
        useReducedMotion.mockImplementation(() => ({ value: true }))

        render(VHeader, options)

        const menuButton = await screen.findByLabelText(/menu/i)

        expect(menuButton).toBeVisible()
      })
      it('shows content switcher button', async () => {
        useMatchSearchRoutes.mockImplementation(() => ({ matches: ref(true) }))
        useMatchHomeRoute.mockImplementation(() => ({ matches: ref(false) }))
        isMinScreen.mockImplementation(() => ref(true))
        useReducedMotion.mockImplementation(() => ({ value: true }))

        render(VHeader, options)
        // Removing this call makes the tests fail
        await screen.getByText(/images/i)

        expect(await screen.getByText(/images/i)).toBeVisible()
      })
    })
    describe('below the medium breakpoint', () => {
      it('does not show page menu', async () => {
        useMatchSearchRoutes.mockImplementation(() => ({ matches: ref(true) }))
        useMatchHomeRoute.mockImplementation(() => ({ matches: ref(false) }))
        isMinScreen.mockImplementation(() => ref(false))
        useReducedMotion.mockImplementation(() => ({ value: true }))

        render(VHeader, options)

        const menuButton = screen.queryByLabelText(/menu/i)

        expect(menuButton).not.toBeInTheDocument()
      })
      it('shows content switcher button', async () => {
        useMatchSearchRoutes.mockImplementation(() => ({ matches: ref(true) }))
        useMatchHomeRoute.mockImplementation(() => ({ matches: ref(false) }))
        isMinScreen.mockImplementation(() => ref(false))
        useReducedMotion.mockImplementation(() => ({ value: true }))

        render(VHeader, options)
        await screen.getByText(/images/i)

        expect(await screen.getByText(/images/i)).toBeVisible()
      })
    })
  })
})
