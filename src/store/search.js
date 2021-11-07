import findIndex from 'lodash.findindex'
import clonedeep from 'lodash.clonedeep'

import local from '~/utils/local'
import {
  filtersToQueryData,
  queryStringToSearchType,
  queryToFilterData,
} from '~/utils/search-query-transform'
import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  supportedMediaTypes,
  VIDEO,
} from '~/constants/media'
import {
  REPLACE_QUERY,
  SET_FILTERS_FROM_URL,
  SET_Q,
  SET_QUERY,
  SET_SEARCH_TYPE_FROM_URL,
  TOGGLE_FILTER,
  UPDATE_QUERY,
  UPDATE_SEARCH_TYPE,
} from '~/constants/action-types'
import {
  SET_FILTER,
  SET_PROVIDERS_FILTERS,
  CLEAR_FILTERS,
  SET_FILTER_IS_VISIBLE,
  UPDATE_FILTERS,
  REPLACE_FILTERS,
  SET_SEARCH_TYPE,
  MUTATE_QUERY,
} from '~/constants/mutation-types'

// The order of the keys here is the same as in the side filter display
export const mediaFilterKeys = {
  image: [
    'licenses',
    'licenseTypes',
    'imageCategories',
    'imageExtensions',
    'aspectRatios',
    'sizes',
    'imageProviders',
    'searchBy',
    'mature',
  ],
  audio: process.env.enableAudio
    ? [
        'licenses',
        'licenseTypes',
        'audioCategories',
        'audioExtensions',
        'durations',
        'audioProviders',
        'searchBy',
        'mature',
      ]
    : [],
  video: [],
  all: ['licenses', 'licenseTypes', 'searchBy', 'mature'],
}

export const mediaSpecificFilters = {
  all: ['licenses', 'licenseTypes', 'searchBy', 'mature'],
  image: [
    'imageCategories',
    'imageExtensions',
    'aspectRatios',
    'sizes',
    'imageProviders',
  ],
  audio: process.env.enableAudio
    ? ['audioCategories', 'audioExtensions', 'durations', 'audioProviders']
    : [],
  video: [],
}

export const filterData = {
  licenses: [
    { code: 'cc0', name: 'filters.licenses.cc0', checked: false },
    { code: 'pdm', name: 'filters.licenses.pdm', checked: false },
    { code: 'by', name: 'filters.licenses.by', checked: false },
    { code: 'by-sa', name: 'filters.licenses.by-sa', checked: false },
    { code: 'by-nc', name: 'filters.licenses.by-nc', checked: false },
    { code: 'by-nd', name: 'filters.licenses.by-nd', checked: false },
    { code: 'by-nc-sa', name: 'filters.licenses.by-nc-sa', checked: false },
    { code: 'by-nc-nd', name: 'filters.licenses.by-nc-nd', checked: false },
  ],
  licenseTypes: [
    {
      code: 'commercial',
      name: 'filters.license-types.commercial',
      checked: false,
    },
    {
      code: 'modification',
      name: 'filters.license-types.modification',
      checked: false,
    },
  ],
  audioCategories: [
    {
      code: 'music',
      name: 'filters.audio-categories.music',
      checked: false,
    },
    {
      code: 'soundEffects',
      name: 'filters.audio-categories.sound-effects',
      checked: false,
    },
    {
      code: 'podcast',
      name: 'filters.audio-categories.podcast',
      checked: false,
    },
  ],
  imageCategories: [
    {
      code: 'photograph',
      name: 'filters.image-categories.photograph',
      checked: false,
    },
    {
      code: 'illustration',
      name: 'filters.image-categories.illustration',
      checked: false,
    },
    {
      code: 'digitized_artwork',
      name: 'filters.image-categories.digitized-artwork',
      checked: false,
    },
  ],
  audioExtensions: [
    { code: 'mp3', name: 'filters.audio-extensions.mp3', checked: false },
    { code: 'ogg', name: 'filters.audio-extensions.ogg', checked: false },
    { code: 'flac', name: 'filters.audio-extensions.flac', checked: false },
  ],
  imageExtensions: [
    { code: 'jpg', name: 'filters.image-extensions.jpg', checked: false },
    { code: 'png', name: 'filters.image-extensions.png', checked: false },
    { code: 'gif', name: 'filters.image-extensions.gif', checked: false },
    { code: 'svg', name: 'filters.image-extensions.svg', checked: false },
  ],
  aspectRatios: [
    { code: 'tall', name: 'filters.aspect-ratios.tall', checked: false },
    { code: 'wide', name: 'filters.aspect-ratios.wide', checked: false },
    { code: 'square', name: 'filters.aspect-ratios.square', checked: false },
  ],
  durations: [
    { code: 'short', name: 'filters.durations.short', checked: false },
    { code: 'medium', name: 'filters.durations.medium', checked: false },
    { code: 'long', name: 'filters.durations.long', checked: false },
  ],
  sizes: [
    { code: 'small', name: 'filters.sizes.small', checked: false },
    { code: 'medium', name: 'filters.sizes.medium', checked: false },
    { code: 'large', name: 'filters.sizes.large', checked: false },
  ],
  audioProviders: [],
  imageProviders: [],
  searchBy: [
    { code: 'creator', name: 'filters.searchBy.creator', checked: false },
  ],
  mature: false,
}
const supportedTabTypes = [AUDIO, IMAGE]
if (process.env.enableAudio) {
  supportedTabTypes.unshift(ALL_MEDIA)
}
const searchTabToMediaType = process.env.enableAudio
  ? {
      [ALL_MEDIA]: IMAGE,
      [AUDIO]: AUDIO,
      [IMAGE]: IMAGE,
      [VIDEO]: null,
    }
  : {
      [ALL_MEDIA]: IMAGE,
      [AUDIO]: null,
      [IMAGE]: IMAGE,
      [VIDEO]: null,
    }
/**
 * Returns true if any of the filters' checked property is true
 * except for `mature` filter, as it is not displayed as a tag
 * @param filters
 * @returns {boolean}
 */
const anyFilterApplied = (filters = {}) =>
  Object.keys(filters).some((filterKey) => {
    if (filterKey === 'mature') {
      return false
    } // this is hardcoded to "false" because we do not show mature in `FilterDisplay.vue` like the other filters

    return (
      filters[filterKey] && filters[filterKey].some((filter) => filter.checked)
    )
  })

export const state = () => ({
  filters: clonedeep(filterData),
  isFilterVisible: false,
  searchType: IMAGE,
  query: {
    q: '',
    mediaType: IMAGE,
    license: '',
    license_type: '',
    categories: '',
    extension: '',
    duration: '',
    aspect_ratio: '',
    size: '',
    source: '',
    searchBy: '',
    mature: false,
  },
})

export const getters = {
  /**
   * Returns the search query parameters for API request:
   * drops `mediaType` parameter, and all parameters with blank values.
   * @param state
   * @return {{}}
   */
  searchQueryParams: (state) => {
    // Ensure that q filter always comes first
    const params = { q: state.query.q }
    // Remove the mediaType parameter, and handle mature filter separately
    const filterKeys = Object.keys(state.query).filter(
      (key) => !['q', 'mediaType', 'mature'].includes(key)
    )
    filterKeys.forEach((key) => {
      if (state.query[key].length) {
        params[key] = state.query[key]
      }
    })
    if (state.query.mature === true) {
      params.mature = true
    }
    return params
  },
  /**
   * Returns all applied filters in unified format
   * Mature filter is not returned because it is not displayed
   * as a filter tag
   * @param state
   * @returns {{code: string, name: string, filterType: string}[]}
   */
  appliedFilterTags: (state) => {
    let appliedFilters = []
    if (state.query.mediaType) {
      const filterKeys = mediaFilterKeys[state.query.mediaType]
      filterKeys.forEach((filterType) => {
        if (filterType !== 'mature') {
          const newFilters = state.filters[filterType]
            .filter((f) => f.checked)
            .map((f) => {
              return {
                code: f.code,
                name: f.name,
                filterType: filterType,
              }
            })
          appliedFilters = [...appliedFilters, ...newFilters]
        }
      })
    }
    return appliedFilters
  },
  isAnyFilterApplied: (state) => {
    return anyFilterApplied(
      getMediaTypeFilters({
        filters: state.filters,
        mediaType: state.query.mediaType,
      })
    )
  },
  mediaFiltersForDisplay: (state) => {
    return getMediaTypeFilters({
      filters: state.filters,
      mediaType: state.query.mediaType,
      includeMature: false,
    })
  },
}

const actions = {
  /**
   * Toggles a filter's checked parameter
   * @param {import('vuex').ActionContext} context
   * @param params
   */
  async [TOGGLE_FILTER]({ commit, dispatch, state }, params) {
    const { filterType, code } = params
    const filters = state.filters[filterType]
    const codeIdx = findIndex(filters, (f) => f.code === code)

    commit(SET_FILTER, { codeIdx, ...params })
    await dispatch(UPDATE_QUERY)
  },

  /**
   * Resets all filters to initial values.
   * Provider filters are not in the initial filters, so they need to be
   * handled separately.
   * @param {import('vuex').ActionContext} context
   */
  async [CLEAR_FILTERS]({ commit, dispatch, state }) {
    const initialFilters = clonedeep(filterData)
    const resetProviders = (mediaType) => {
      return state.filters[`${mediaType}Providers`].map((provider) => ({
        ...provider,
        checked: false,
      }))
    }
    const newFilterData = {
      ...initialFilters,
      audioProviders: resetProviders(AUDIO),
      imageProviders: resetProviders(IMAGE),
    }
    commit(REPLACE_FILTERS, { newFilterData })
    await dispatch(UPDATE_QUERY)
  },

  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param url
   */
  [SET_FILTERS_FROM_URL]({ commit }, { url }) {
    const newFilterData = queryToFilterData(url)
    commit(REPLACE_FILTERS, { newFilterData })
  },

  /**
   * On the first page load, sets the search type and updates search filters.
   *
   * @param {import('vuex').ActionContext} context
   * @param {{ url: string }} params
   */
  [SET_SEARCH_TYPE_FROM_URL]({ commit }, params) {
    const searchType = queryStringToSearchType(params.url)
    commit(SET_SEARCH_TYPE, { searchType })
    commit(UPDATE_FILTERS, { searchType })
  },

  /**
   * On selecting a search tab, updates the search type and
   * sets the filters that are applicable for this media type.
   * @param {import('vuex').ActionContext} context
   * @param searchType
   */
  async [UPDATE_SEARCH_TYPE]({ commit, dispatch }, { searchType }) {
    commit(SET_SEARCH_TYPE, { searchType })
    commit(UPDATE_FILTERS, { searchType })
    await dispatch(UPDATE_QUERY)
  },
  /**
   * After a change in filters, updates the query.
   * @param {import('vuex').ActionContext} context
   */
  async [UPDATE_QUERY]({ state, commit }) {
    const newQuery = filtersToQueryData(
      state.filters,
      state.query.mediaType,
      false
    )
    const query = {
      ...newQuery,
      q: state.query.q || '',
      mediaType: state.query.mediaType,
    }
    commit(MUTATE_QUERY, { query })
  },
  /**
   * Merges the query object from parameters with the existing
   * query object. Used on 'Search' button click.
   * Reset the media state.
   * @param {import('vuex').ActionContext} context
   * @param {object} query
   */
  [SET_QUERY]({ state, commit }, { query }) {
    const newQuery = Object.assign({}, state.query, query)
    commit(MUTATE_QUERY, { query: newQuery })
  },
  /**
   * When a new search term is searched for, sets the `q`
   * parameter for the API request query and resets the media.
   * Leaves other query parameters for filters as before.
   * Reset the media state.
   * @param {import('vuex').ActionContext} context
   * @param {string} q
   */
  [SET_Q]({ state, commit }, { q }) {
    const query = { ...state.query, q }
    commit(MUTATE_QUERY, { query })
  },
  /**
   * Replaces the query object completely. Called when filters are updated.
   * @param {import('vuex').ActionContext} context
   * @param {object} query
   */
  [REPLACE_QUERY]({ commit, state }, { query }) {
    if (!query.mediaType) {
      query.mediaType = state.query.mediaType
    }
    commit(MUTATE_QUERY, { query })
  },
}

function getMediaTypeFilters({ filters, mediaType, includeMature = false }) {
  if (![ALL_MEDIA, AUDIO, IMAGE, VIDEO].includes(mediaType)) {
    mediaType = ALL_MEDIA
  }
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

// Make sure when redirecting after applying a filter, we stick to the right tab (i.e, "/search/video", "/search/audio", etc.)
const mutations = {
  /**
   * After a search type is changed, unchecks all the filters that are not
   * applicable for this Media type.
   * @param state
   * @param searchType
   */
  [UPDATE_FILTERS](state, { searchType }) {
    const mediaTypesToClear = supportedMediaTypes.filter(
      (media) => media !== searchType
    )

    let filterKeysToClear = []
    mediaTypesToClear.forEach((mediaType) => {
      const filterKeys = mediaSpecificFilters[mediaType]
      filterKeysToClear = [...filterKeysToClear, ...filterKeys]
    })

    Object.keys(state.filters).forEach((filterType) => {
      if (filterKeysToClear.includes(filterType)) {
        state.filters[filterType] = state.filters[filterType].map((f) => ({
          ...f,
          checked: false,
        }))
      }
    })
  },
  [REPLACE_FILTERS](state, { newFilterData }) {
    Object.keys(state.filters).forEach((filterType) => {
      if (filterType === 'mature') {
        state.filters.mature = newFilterData.mature
      } else if (['audioProviders', 'imageProviders'].includes(filterType)) {
        newFilterData[filterType].forEach((provider) => {
          const idx = state.filters[filterType].findIndex(
            (p) => p.code === provider.code
          )
          if (idx > -1) {
            state.filters[filterType][idx].checked = provider.checked
          }
        })
      } else {
        state.filters[filterType] = newFilterData[filterType]
      }
    })
  },
  [SET_FILTER](state, params) {
    const { filterType, codeIdx } = params
    if (filterType === 'mature') {
      state.filters.mature = !state.filters.mature
    } else {
      const filters = state.filters[filterType]
      filters[codeIdx].checked = !filters[codeIdx].checked
    }
  },
  [SET_PROVIDERS_FILTERS](state, params) {
    const { mediaType, providers } = params
    // merge providers from API response with the filters that came from the
    // browse URL search query string and match the checked properties
    // in the store
    const providersKey = `${mediaType}Providers`
    const currentProviders = [...state.filters[providersKey]]
    state.filters[providersKey] = providers.map((provider) => {
      const existingProviderFilterIdx = findIndex(
        currentProviders,
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
  },
  [SET_FILTER_IS_VISIBLE](state, params) {
    state.isFilterVisible = params.isFilterVisible
    local.set(process.env.filterStorageKey, params.isFilterVisible)
  },
  [SET_SEARCH_TYPE](_state, params) {
    _state.searchType = params.searchType
    _state.query.mediaType = searchTabToMediaType[params.searchType]
  },
  [MUTATE_QUERY](state, { query }) {
    if (!query.mediaType) {
      query = {
        ...query,
        mediaType: state.query.mediaType,
      }
    }
    state.query = query
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
