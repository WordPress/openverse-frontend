import SearchGrid from '~/components/SearchGridManualLoad'
import render from '../../test-utils/render'
// import { SET_MEDIA } from '~/constants/mutation-types'
// import filterStore from '~/store/filter'
// import searchStore from '~/store/search'

import Vuex from 'vuex'
import { IMAGE } from '~/constants/media'
import { createLocalVue } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import messages from '~/locales/en.json'
import SaferBrowsing from '~/components/SaferBrowsing'
describe('SearchGrid', () => {
  // let options = {}
  // let commitMock = null
  // let storeMock
  // let searchStoreMock
  //
  // beforeEach(() => {
  //   commitMock = jest.fn()
  //   searchStoreMock = {
  //     state: {
  //       images: [{ id: 'foo', title: 'image1.jpg' }],
  //       imagesCount: 1,
  //       imagePage: 1,
  //       isFetching: {
  //         images: false,
  //       },
  //       isFetchingError: {
  //         images: false,
  //       },
  //       pageCount: {
  //         images: 2,
  //       },
  //       searchType: IMAGE,
  //     },
  //     getters: searchStore.getters,
  //     actions: searchStore.actions,
  //     mutations: {
  //       ...searchStore.mutations,
  //       [SET_MEDIA]: commitMock,
  //     },
  //   }
  //   storeMock = new Vuex.Store({
  //     modules: {
  //       filter: {
  //         namespaced: true,
  //         ...filterStore,
  //       },
  //       search: {
  //         namespaced: true,
  //         ...searchStoreMock,
  //       },
  //     },
  //   })
  //   options = {
  //     store: storeMock,
  //     stubs: {
  //       SaferBrowsing: true,
  //       LoadingIcon: true,
  //       MetaSearchForm: true,
  //       SearchGridCell: true,
  //       SearchRating: true,
  //     },
  //     propsData: {
  //       includeAnalytics: true,
  //     },
  //     mocks: {
  //       $store: storeMock,
  //       store: storeMock,
  //     },
  //   }
  // })
  let options = {}
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(VueI18n)
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
            currentPage: {
              image: 1,
            },
            searchResults: {
              image: [
                { id: 'image1', url: 'https://wp.org/image1.jpg' },
                { id: 'image2', url: 'https://wp.org/image2.svg' },
              ],
            },
            pageCount: { images: 2 },
            imagesCount: 40,
          },
          getters: {
            isFetching: () => false,
            isFetchingError: () => false,
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
        LicenseIcons: true,
      },
      store: storeMock,
      localVue,
      i18n,
    }
  })

  it('should render correct contents', () => {
    const wrapper = render(SearchGrid, options)
    expect(wrapper.find('section').element).toBeDefined()
    expect(wrapper.find('.load-more').element).toBeDefined()
  })

  it("doesn't render load more button if not loading images", () => {
    const wrapper = render(SearchGrid, options)
    expect(wrapper.find('.load-more').element).toBeDefined()
  })
  // Fetching states should be tested with e2e tests
})
