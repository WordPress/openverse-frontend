import {
  state as SearchState,
  // actions as SearchActions,
  mutations as SearchMutations,
} from '~/store/search'
import {
  state as ProviderState,
  // actions as ProviderActions,
  // mutations as ProviderMutations,
} from '~/store/provider'
import {
  state as FilterState,
  actions as FilterActions,
  mutations as FilterMutations,
} from '~/store/filter'
import { IMAGE } from '~/constants/media'

const store = {
  state: {
    searchType: IMAGE,
  },
  modules: {
    search: {
      state: SearchState(),
      mutations: SearchMutations,
    },
    provider: {
      state: ProviderState(),
    },
    filter: {
      state: FilterState(),
      mutations: FilterMutations,
      actions: FilterActions,
    },
  },
  dispatch: jest.fn(),
  commit: jest.fn(),
}

export default store
