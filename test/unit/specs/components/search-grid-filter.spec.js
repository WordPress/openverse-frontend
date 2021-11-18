import Vuex from 'vuex'
import { fireEvent, render, screen } from '@testing-library/vue'
import { createLocalVue } from '@vue/test-utils'
import { UPDATE_QUERY } from '~/constants/action-types'
import { IMAGE } from '~/constants/media'
import store from '~/store/search'
import clonedeep from 'lodash.clonedeep'
import VCheckbox from '~/components/VCheckbox'
import SearchGridFilter from '~/components/Filters/SearchGridFilter'
import VCheckbox from '~/components/VCheckbox'

const initialFilters = {
  licenseTypes: [
    {
      code: 'commercial',
      name: 'Commercial usage',
      checked: false,
    },
  ],
  licenses: [{ code: 'by', name: 'CC-BY', checked: false }],
  imageCategories: [{ code: 'photo', name: 'Photographs', checked: false }],
  imageExtensions: [{ code: 'jpg', name: 'JPG', checked: false }],
  imageProviders: [{ code: 'met', name: 'Metropolitan', checked: false }],
  audioProviders: [{ code: 'jamendo', name: 'Jamendo', checked: false }],
  aspectRatios: [],
  searchBy: [{ code: 'creator', checked: false }],
  mature: false,
}

describe('SearchGridFilter', () => {
  let options = {}
  let props = null
  let storeMock
  let localVue
  let filters

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.component('VCheckbox', VCheckbox)
    filters = clonedeep(initialFilters)
    storeMock = new Vuex.Store({
      modules: {
        search: {
          namespaced: true,
          state: {
            searchType: IMAGE,
            isFilterVisible: true,
            filters,
            query: {
              q: '',
              mediaType: IMAGE,
            },
          },
          mutations: store.mutations,
          actions: store.actions,
          getters: store.getters,
        },
        media: {
          namespaced: true,
          state: {
            imagesCount: 2,
          },
        },
      },
    })

    options = {
      localVue,
      propsData: props,
      mocks: {
        $store: storeMock,
      },
    }
  })

  it('should show search filters when isFilterVisible is true', async () => {
    storeMock.state.search.isFilterVisible = true
    await render(SearchGridFilter, options)
    expect(screen.getByTestId('filters-list')).toBeVisible()
    expect(screen.getByTestId('filters-list')).toHaveClass('block')
  })

  it('should not show search filters when isFilterVisible is false', async () => {
    storeMock.state.search.isFilterVisible = false
    await render(SearchGridFilter, options)

    // not.toBeVisible does not work
    expect(screen.getByTestId('filters-list')).toHaveClass('hidden')
  })

  it('toggles filter', async () => {
    render(SearchGridFilter, options)
    const checked = screen.queryAllByRole('checkbox', { checked: true })
    expect(checked.length).toEqual(0)

    await fireEvent.click(screen.queryByLabelText(/commercial/i))

    // `getBy` serves as expect because it throws an error if no element is found
    screen.getByRole('checkbox', { checked: true })
    screen.getByLabelText('Commercial usage', { checked: true })
  })

  it('clears filters', async () => {
    storeMock.state.search.filters.licenses[0].checked = true
    await render(SearchGridFilter, options)
    // if no checked checkboxes were found, this would raise an error
    screen.getByRole('checkbox', { checked: true })

    await fireEvent.click(screen.getByText('filter-list.clear'))
    const checkedFilters = screen.queryAllByRole('checkbox', { checked: true })
    const uncheckedFilters = screen.queryAllByRole('checkbox', {
      checked: false,
    })
    expect(checkedFilters.length).toEqual(0)
    // Filters are reset with the initial `filterData`
    expect(uncheckedFilters.length).toEqual(22)
  })

  it('toggles search visibility', async () => {
    render(SearchGridFilter, options)
    const element = screen.getByTestId('filters-list')

    expect(element).toBeVisible()
    expect(element).toHaveClass('block')

    await fireEvent.click(screen.getByText('filter-list.hide'))
    expect(element).toHaveClass('hidden')
  })
})
