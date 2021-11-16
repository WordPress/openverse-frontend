import Vuex from 'vuex'
import { render, screen } from '@testing-library/vue'
import { IMAGE } from '~/constants/media'
import { createLocalVue } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import messages from '~/locales/en.json'
import SearchGrid from '~/components/SearchGrid'
import SaferBrowsing from '~/components/SaferBrowsing'
import SearchGridCell from '~/components/SearchGridCell'

describe('SearchGrid', () => {
  let options = {}
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(VueI18n)
  localVue.component('SearchGridCell', SearchGridCell)
  let storeMock

  const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: messages },
  })
  localVue.prototype.$nuxt = {
    nbFetching: 0,
  }
  localVue.component('SaferBrowsing', SaferBrowsing)

  beforeEach(() => {
    storeMock = new Vuex.Store({
      modules: {
        search: {
          namespaced: true,
          state: {
            query: { q: 'foo', mediaType: IMAGE },
            filters: {
              licenseTypes: [
                { code: 'commercial', name: 'Commercial usage' },
                { code: 'modification', name: 'Allows modification' },
              ],
            },
          },
          getters: {
            isSearchTabSupported: () => true,
          },
        },
        media: {
          namespaced: true,
          state: {
            results: {
              image: {
                count: 40,
                page: 1,
                pageCount: 2,
                items: [
                  { id: 'image1', url: 'https://wp.org/image1.jpg' },
                  { id: 'image2', url: 'https://wp.org/image2.svg' },
                ],
              },
            },
          },
          getters: {
            fetchState: () => ({
              isFetching: false,
              fetchingError: null,
            }),
            isFinished: () => false,
            results: () => ({
              count: 40,
              page: 1,
              pageCount: 2,
              items: [
                { id: 'image1', url: 'https://wp.org/image1.jpg' },
                { id: 'image2', url: 'https://wp.org/image2.svg' },
              ],
            }),
          },
        },
      },
    })
    options = {
      stubs: {
        // SearchRating: true,
        LoadingIcon: true,
        MetaSearchForm: true,
        NuxtLink: true,
        // SaferBrowsing: true,
        VLicense: true,
      },
      store: storeMock,
      localVue,
      i18n,
    }
  })

  it('should render correct contents', async () => {
    render(SearchGrid, options)

    // Meta information
    // Result count
    screen.getByText(/40 image results/)
    // Search rating
    screen.getByText(/search-rating.content/)
    screen.getAllByRole('button', { text: /yes/i })
    screen.getAllByRole('button', { text: /no/i })
    // Safer browsing
    screen.getAllByRole('button', { text: /safer-browsing/i })
  })
  // Fetching states should be tested with e2e tests
})
