import { defineStore } from 'pinia'
import { computed, reactive, readonly, ref } from '@nuxtjs/composition-api'
import clonedeep from 'lodash.clonedeep'

import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  supportedSearchTypes,
} from '~/constants/media'
import { queryToFilterData } from '~/utils/search-query-transform'
import {
  filterData,
  mediaFilterKeys,
  mediaUniqueFilterKeys,
} from '~/constants/filters'
import { warn } from '~/utils/console'

export const useFilterStore = defineStore('filter', () => {
  /** @type {{ filters: import('../store/types').Filters}} */
  const filters = reactive(clonedeep(filterData))
  const searchType = ref(ALL_MEDIA)

  /**
   * @param {import('../store/types').SearchType} type
   */
  const setSearchType = (type) => (searchType.value = type)
  /**
   *
   * @param {{ mediaType: import('../store/types').SearchType, includeMature?: boolean }} params
   * @returns {Partial<import('../store/types').Filters>}
   */
  function getMediaTypeFilters({ mediaType, includeMature = false }) {
    let filterKeys = mediaFilterKeys[mediaType]
    if (!includeMature) {
      filterKeys = filterKeys.filter((filterKey) => filterKey !== 'mature')
    }
    const mediaTypeFilters = {}
    filterKeys.forEach((filterKey) => {
      mediaTypeFilters[filterKey] = filters[filterKey]
    })
    return mediaTypeFilters
  }
  /**
   * Initial filters do not include the provider filters. We create the provider filters object
   * when we fetch the provider data on the Nuxt server initialization.
   * We call this function to reset the filters to the initial base filters AND the provider filters.
   * @returns {import('../store/types').Filters}
   */
  const getBaseFiltersWithProviders = () => {
    /**
     * @param {import('../store/types').SupportedMediaType} mediaType
     * @returns {import('../store/types').FilterItem[]}
     */
    const resetProviders = (mediaType) => {
      return filters[`${mediaType}Providers`].map((provider) => ({
        ...provider,
        checked: false,
      }))
    }
    return {
      ...clonedeep(filterData),
      audioProviders: resetProviders(AUDIO),
      imageProviders: resetProviders(IMAGE),
    }
  }

  /**
   * Returns the number of checked filters, excluding the `mature` filter.
   *
   * @type {import('@nuxtjs/composition-api').ComputedRef<number>}
   */
  const appliedFilterCount = computed(() => {
    const filterKeys = mediaFilterKeys[searchType.value].filter(
      (f) => f !== 'mature'
    )
    return filterKeys.reduce((count, filterType) => {
      return count + filters[filterType].filter((f) => f.checked).length
    }, 0)
  })

  /**
   * Returns true if any of the filters' checked property is true
   * except for `mature` filter, as it is not displayed as a tag.
   * @param {Partial<import('~/store/types').Filters>} filters
   * @returns {boolean}
   */
  const anyFilterApplied = (filters = {}) => {
    // filtering out `mature` because we do not show mature in `FilterDisplay.vue` like the other filters
    return Object.keys(filters).some(
      (filterKey) =>
        filterKey !== 'mature' &&
        filters[filterKey]?.some((filter) => filter.checked)
    )
  }

  /**
   * True if any filter except `mature` is applied.
   *
   * @type {import('@nuxtjs/composition-api').ComputedRef<boolean>}
   */
  const isAnyFilterApplied = computed(() => {
    return anyFilterApplied(
      getMediaTypeFilters({
        filters,
        mediaType: searchType.value,
      })
    )
  })

  /**
   * After a search type is changed, unchecks all the filters that are not
   * applicable for this Media type.
   * @param {{ searchType: import('../store/types').SearchType }} props
   */
  function clearOtherMediaTypeFilters({ searchType }) {
    const mediaTypesToClear = supportedSearchTypes.filter(
      (type) => type !== searchType
    )
    let filterKeysToClear = mediaTypesToClear.reduce((acc, type) => {
      acc = [...acc, ...mediaUniqueFilterKeys[type]]
      return acc
    }, [])

    Object.keys(filters).forEach((filterType) => {
      if (filterKeysToClear.includes(filterType)) {
        filters[filterType] = filters[filterType].map((f) => ({
          ...f,
          checked: false,
        }))
      }
    })
  }

  /**
   * Replaces filters with the newFilterData parameter, making sure that
   * audio/image provider filters are handled correctly.
   *
   * @param {object} params
   * @param {import('../store/types').Filters} params.newFilterData
   */
  function replaceFilters({ newFilterData }) {
    Object.keys(filters).forEach((filterType) => {
      if (['audioProviders', 'imageProviders'].includes(filterType)) {
        newFilterData[filterType].forEach((provider) => {
          const idx = filters[filterType].findIndex(
            (p) => p.code === provider.code
          )
          if (idx > -1) {
            filters[filterType][idx].checked = provider.checked
          }
        })
      } else {
        filters[filterType] = newFilterData[filterType]
      }
    })
  }

  /**
   * @param {{ mediaType: import('../store/types').SupportedMediaType, providers: {source_name: string, display_name: string}[]}} params
   */
  function initProviderFilters({ mediaType, providers }) {
    // merge providers from API response with the filters that came from the
    // browse URL search query string and match the checked properties
    // in the store
    const providersKey = `${mediaType}Providers`
    const currentProviders = filters[providersKey]
      ? [...filters[providersKey]]
      : []
    filters[providersKey] = providers.map((provider) => {
      const existingProviderFilterIdx = currentProviders.findIndex(
        (p) => p.code === provider.source_name
      )
      const checked =
        existingProviderFilterIdx >= 0
          ? currentProviders[existingProviderFilterIdx].checked
          : false

      return {
        code: provider.source_name,
        name: provider.display_name,
        checked,
      }
    })
  }
  /**
   * Toggles a filter's checked parameter. Requires either codeIdx or code.
   * @param {{ filterType: string, codeIdx?: number, code?: string}} params
   */
  function toggleFilter(params) {
    if (
      typeof params.codeIdx === 'undefined' &&
      typeof params.code === 'undefined'
    ) {
      warn(
        `Cannot toggle filter of type ${params.filterType}. Use code or codeIdx parameter`
      )
      return
    }
    const { filterType } = params
    let codeIdx =
      params.codeIdx ??
      filters[filterType].findIndex((f) => f.code === params.code)
    filters[filterType][codeIdx].checked = !filters[filterType][codeIdx].checked
  }

  /**
   *
   * @param {Record<string, string>} searchQuery
   * @param {import('../store/types').SupportedSearchType} searchType
   */
  function updateFiltersFromUrl(searchQuery, searchType) {
    // When setting filters from URL query, 'mature' has a value of 'true',
    // but we need the 'mature' code. Creating a local shallow copy to prevent mutation.
    const query = { ...searchQuery }
    if (query.mature === 'true') {
      query.mature = 'mature'
    } else {
      delete query.mature
    }

    const newFilterData = queryToFilterData({
      query,
      searchType,
      defaultFilters: getBaseFiltersWithProviders(),
    })
    replaceFilters({ newFilterData })
  }
  /**
   * Resets all filters to initial values.
   * Provider filters are not in the initial filters, so they need to be
   * handled separately.
   *
   */
  function clearFilters() {
    replaceFilters({
      newFilterData: getBaseFiltersWithProviders(),
    })
  }

  /**
   * Selecting some filter items disables related items. For example, selecting an `nc`
   * license filter (CC BY-NC, CC BY-NC-SA, CC BY-NC-ND) disables the `Commercial` license
   * type filter. This function determines if the filter item should be disabled based on
   * the currently checked filter items.
   *
   * @param {import('../store/types').FilterItem} item
   * @returns {boolean|undefined}
   */
  function isFilterDisabled(item) {
    if (['commercial', 'modification'].includes(item.code)) {
      let targetCode = /** @type {string} */ (
        { commercial: 'nc', modification: 'nd' }[item.code]
      )
      return filters.licenses.some(
        (item) => item.code.includes(targetCode) && item.checked
      )
    } else {
      /** @type {string[]} */
      const dependentFilters = []
      if (item.code.includes('nc')) {
        dependentFilters.push('commercial')
      }
      if (item.code.includes('nd')) {
        dependentFilters.push('modification')
      }
      return filters.licenseTypes
        .filter((item) => dependentFilters.includes(item.code))
        .some((item) => item.checked)
    }
  }

  return {
    appliedFilterCount,
    isAnyFilterApplied,

    getMediaTypeFilters,
    initProviderFilters,
    isFilterDisabled,
    // These are used by the searchStore internally
    clearOtherMediaTypeFilters,
    clearFilters,
    setSearchType,
    toggleFilter,
    updateFiltersFromUrl,
    // Filters are exported for testing
    filters: readonly(filters),
  }
})
