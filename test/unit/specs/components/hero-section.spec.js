import HeroSection from '~/components/HeroSection'
import { fireEvent, render, screen } from '@testing-library/vue'
import filterStore, { filterData } from '~/store/filter'
import store from '~/store/search'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import clonedeep from 'lodash.clonedeep'

describe('HeroSection', () => {
  let options = {}
  let localVue
  let storeMock
  let filters
  const routerMock = { push: jest.fn() }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    filters = clonedeep(filterData)
    storeMock = new Vuex.Store({
      modules: {
        filter: {
          namespaced: true,
          ...filterStore,
          state: {
            isFilterVisible: true,
            filters,
          },
        },
        search: {
          namespaced: true,
          ...store,
        },
      },
    })
    options = {
      mocks: {
        $router: routerMock,
        $store: storeMock,
      },
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
