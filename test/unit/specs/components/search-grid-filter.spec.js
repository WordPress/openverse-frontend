import Vuex from 'vuex'
import { fireEvent, render, screen } from '@testing-library/vue'
import { createLocalVue } from '@vue/test-utils'
import SearchGridFilter from '~/components/VFilters/VSearchGridFilter.vue'
import { FETCH_MEDIA } from '~/constants/action-types'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useFilterStore } from '~/stores/filter'

describe('SearchGridFilter', () => {
  let options = {}
  let storeMock
  let localVue
  let pinia
  let filterStore
  const routerMock = { push: jest.fn() }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(PiniaVuePlugin)
    pinia = createPinia()
    storeMock = new Vuex.Store({
      modules: {
        media: {
          namespaced: true,
          state: {
            imagesCount: 2,
          },
          actions: {
            [FETCH_MEDIA]: jest.fn(),
          },
        },
      },
    })

    options = {
      localVue,
      mocks: {
        $router: routerMock,
        $store: storeMock,
        $nuxt: {
          context: {
            i18n: { t: (s) => s },
            store: storeMock,
          },
        },
      },
      stubs: { VIcon: true },
      pinia,
    }
  })

  it('toggles filter', async () => {
    render(SearchGridFilter, options)
    const checked = screen.queryAllByRole('checkbox', { checked: true })
    expect(checked.length).toEqual(0)

    await fireEvent.click(screen.queryByLabelText(/commercial/i))
    // `getBy` serves as expect because it throws an error if no element is found
    screen.getByRole('checkbox', { checked: true })
    screen.getByLabelText(/commercial/, { checked: true })
  })

  it('clears filters', async () => {
    filterStore = useFilterStore(pinia)
    filterStore.toggleFilter({ filterType: 'licenses', code: 'by' })
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
    expect(uncheckedFilters.length).toEqual(11)
  })
})
