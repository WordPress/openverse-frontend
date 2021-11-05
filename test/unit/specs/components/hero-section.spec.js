import Vuex from 'vuex'
import HeroSection from '~/components/HeroSection'
import { fireEvent, render, screen } from '@testing-library/vue'
import searchStore, { filterData } from '~/store/search'
import mediaStore from '~/store/media'
import { createLocalVue } from '@vue/test-utils'
import clonedeep from 'lodash.clonedeep'
import VueI18n from 'vue-i18n'
import messages from '~/locales/en.json'

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: messages },
})

describe('HeroSection', () => {
  let options = {}
  let localVue
  let storeMock
  let filters
  const routerMock = { push: jest.fn() }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueI18n)
    localVue.use(Vuex)
    filters = clonedeep(filterData)
    storeMock = new Vuex.Store({
      modules: {
        search: {
          namespaced: true,
          ...mediaStore,
          ...searchStore,
          state: {
            isFilterVisible: true,
            filters,
          },
        },
      },
    })
    options = {
      mocks: {
        $router: routerMock,
        $store: storeMock,
      },
      i18n,
    }
  })
  it('should render correct contents', () => {
    render(HeroSection, options)
    screen.getByRole('search')
  })

  it('should search when a query is entered', async () => {
    render(HeroSection, options)

    const searchBox = screen.getByRole('searchbox')
    await fireEvent.update(searchBox, 'me')
    await fireEvent.click(screen.queryByTitle('Search'))

    expect(routerMock.push).toHaveBeenCalledWith({
      path: '/search/image',
      query: { q: 'me' },
    })
  })
})
