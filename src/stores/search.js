import { defineStore } from 'pinia'
import { computed, reactive, readonly, toRefs } from '@nuxtjs/composition-api'

import { ALL_MEDIA } from '~/constants/media'
import { useFilterStore } from '~/stores/filter'

import {
  filtersToQueryData,
  queryStringToSearchType,
} from '~/utils/search-query-transform'

/**
 * Store information about the search type and search query.
 * Search query is based on the filter values, but has important differences:
 * - parameter names are the names that the API expects.
 * - some parameter names correspond to different filter names for different media types:
 * `categories` can mean `imageCategories` if the current `searchType` is `IMAGE`, or `audioCategories`
 * if it is `AUDIO`.
 * - query parameter values are the values that are used in the API query.
 */
export const useSearchStore = defineStore('search', () => {
  const filterStore = useFilterStore()
  /**
   * @type {import('../store/types').SearchState}}
   */
  const state = reactive({
    searchType: ALL_MEDIA,
    query: {
      q: '',
      license_type: '',
      license: '',
      categories: '',
      extension: '',
      duration: '',
      aspect_ratio: '',
      size: '',
      source: '',
      searchBy: '',
      // mature can be either 'true' or ''
      mature: '',
    },
  })
  const { searchType, query } = toRefs(state)

  /**
   * @param {import('../store/types').SupportedSearchType} type
   */
  const setSearchType = (type) => {
    state.searchType = type
    filterStore.setSearchType(type)
  }

  /**
   * Returns the search query parameters for API request:
   * drops all parameters with blank values.
   *
   * @returns {import('@nuxtjs/composition-api').ComputedRef<import('../store/types').ApiQueryParams>}
   */
  const searchQueryParams = computed(() => {
    // Ensure that q filter always comes first
    return Object.keys(state.query).reduce(
      (obj, key) => {
        return !['q'].includes(key) && state.query[key].length
          ? { ...obj, [key]: state.query[key] }
          : obj
      },
      { q: state.query.q.trim() }
    )
  })

  /**
   * Called when `q` search term or `searchType` are changed.
   * @param {{ q?: string, searchType?: import('../store/types').SupportedSearchType }} params
   *
   */
  function updateQuery(params = {}) {
    const { q, searchType } = params
    if (q) {
      state.query.q = q.trim()
    }
    if (searchType && searchType !== state.searchType) {
      setSearchType(searchType)
      filterStore.clearOtherMediaTypeFilters({ searchType })
    }
    updateQueryFromFilters()
  }

  /**
   * Called when a /search path is server-rendered.
   * @param {{ path: string, query: { [key: string]: string} }} params
   */
  function setSearchStateFromUrl({ path, query }) {
    if (query.q) {
      state.query.q = query.q.trim()
    }

    const searchType = queryStringToSearchType(path)
    setSearchType(searchType)

    filterStore.updateFiltersFromUrl(query, searchType)
    updateQueryFromFilters()
  }
  /**
   * After a change in filters, updates the query. If the filter is not selected, query should be set to blank string "".
   * @param {object} [params]
   * @param {import('../store/types').SupportedSearchType} [params.mediaType]
   * @param {string} [params.q]
   */
  function updateQueryFromFilters(params = {}) {
    const queryFromFilters = filtersToQueryData(
      filterStore.filters,
      params.mediaType || state.searchType,
      true
    )

    // If the filter was unchecked, its value in `queryFromFilters` would be falsy, ''.
    // So we check if the key exists, not if the value is not falsy.
    const changedKeys = /** @type {import('../store/types').QueryKey[]} */ (
      Object.keys(queryFromFilters)
    )
    const queryKeys = /** @type {import('../store/types').QueryKey[]} */ (
      Object.keys(state.query)
    )
    state.query = queryKeys.reduce((obj, key) => {
      if (key === 'q') {
        obj[key] = params?.q || state.query.q
      } else {
        obj[key] = changedKeys.includes(key) ? queryFromFilters[key] : ''
      }
      return obj
    }, /** @type {import('../store/types').Query} */ ({}))
  }

  /**
   * Toggles a filter's checked parameter
   * @param {{ filterType: import('../store/types').FilterCategory, codeIdx?: number, code?: string}} params
   */
  function toggleFilter(params) {
    filterStore.toggleFilter(params)
    updateQueryFromFilters()
  }

  /**
   * Resets all filters to initial values.
   * Provider filters are not in the initial filters, so they need to be
   * handled separately.
   */
  function clearFilters() {
    filterStore.clearFilters()
    updateQueryFromFilters()
  }
  const searchFilters = computed(() => {
    return filterStore.getMediaTypeFilters({ mediaType: searchType.value })
  })

  return {
    state: readonly(state),
    searchType,
    query,
    searchQueryParams,
    searchFilters,
    setSearchStateFromUrl,
    updateQuery,
    toggleFilter,
    clearFilters,
  }
})
