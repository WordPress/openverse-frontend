import prepareSearchQueryParams from '~/utils/prepare-search-query-params'
import {
  FETCH_MEDIA,
  FETCH_SINGLE_MEDIA_TYPE,
  HANDLE_MEDIA_ERROR,
  HANDLE_NO_MEDIA,
  CLEAR_MEDIA,
  FETCH_MEDIA_ITEM,
} from '~/constants/action-types'
import {
  FETCH_END_MEDIA,
  FETCH_MEDIA_ERROR,
  FETCH_START_MEDIA,
  MEDIA_NOT_FOUND,
  RESET_MEDIA,
  SET_MEDIA_ITEM,
  SET_MEDIA,
} from '~/constants/mutation-types'
import {
  SEND_RESULT_CLICKED_EVENT,
  SEND_SEARCH_QUERY_EVENT,
} from '~/constants/usage-data-analytics-types'
import { AUDIO, IMAGE, ALL_MEDIA, supportedMediaTypes } from '~/constants/media'
import { USAGE_DATA } from '~/constants/store-modules'
import MediaService from '~/data/media-service'

/**
 * @return {import('./types').MediaState}
 */
export const state = () => ({
  results: {
    [IMAGE]: {
      count: 0,
      page: undefined,
      pageCount: 0,
      items: {},
    },
    [AUDIO]: {
      count: 0,
      page: undefined,
      pageCount: 0,
      items: {},
    },
  },
  mediaFetchState: {
    audio: {
      isFetching: false,
      fetchingError: null,
      isFinished: false,
    },
    image: {
      isFetching: false,
      fetchingError: null,
      isFinished: false,
    },
  },
  audio: {},
  image: {},
})

export const mediaServices = {
  [AUDIO]: new MediaService(AUDIO),
  [IMAGE]: new MediaService(IMAGE),
}

export const createActions = (services = mediaServices) => ({
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {object} [payload]
   * @return {Promise<void>}
   */
  async [FETCH_MEDIA]({ dispatch, rootState }, payload = {}) {
    const mediaType = rootState.search.searchType
    const mediaToFetch = mediaType !== ALL_MEDIA ? [mediaType] : [IMAGE, AUDIO]

    await Promise.all(
      mediaToFetch.map((type) =>
        dispatch(FETCH_SINGLE_MEDIA_TYPE, { mediaType: type, ...payload })
      )
    )
  },
  /**
   * Do not use with ALL_MEDIA
   * @param {import('vuex').ActionContext} context
   * @param {object} payload
   * @param {import('./types').SupportedMediaType} payload.mediaType
   * @returns {Promise<void>}
   */
  async [CLEAR_MEDIA]({ commit }, payload = {}) {
    const { mediaType } = payload
    commit(RESET_MEDIA, { mediaType })
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {Object} payload
   * @param {import('./types').SupportedMediaType} payload.mediaType - the mediaType to fetch (do not use 'All_media' here)
   * @param {number} [payload.page] - API page to load.
   * @param {boolean} [payload.shouldPersistMedia] - whether the existing media should be added to or replaced.
   * @return {Promise<void>}
   */
  async [FETCH_SINGLE_MEDIA_TYPE](
    { commit, dispatch, rootState, rootGetters },
    payload
  ) {
    const {
      mediaType,
      page = undefined,
      shouldPersistMedia = false,
      ...params
    } = payload

    const queryParams = prepareSearchQueryParams({
      ...rootGetters['search/searchQueryParams'],
      ...params,
    })

    // does not send event if user is paginating for more results
    if (!page) {
      const sessionId = rootState.user.usageSessionId
      await dispatch(
        `${USAGE_DATA}/${SEND_SEARCH_QUERY_EVENT}`,
        { query: queryParams.q, sessionId },
        { root: true }
      )
    }

    commit(FETCH_START_MEDIA, { mediaType })
    try {
      const mediaPage = typeof page === 'undefined' ? page : page[mediaType]

      const data = await services[mediaType].search({
        ...queryParams,
        page: mediaPage,
      })

      commit(FETCH_END_MEDIA, { mediaType })
      const mediaCount = data.result_count
      commit(SET_MEDIA, {
        mediaType,
        media: data.results,
        mediaCount,
        pageCount: data.page_count,
        shouldPersistMedia,
        page: mediaPage,
      })
      await dispatch(HANDLE_NO_MEDIA, {
        mediaType,
        mediaCount,
      })
    } catch (error) {
      await dispatch(HANDLE_MEDIA_ERROR, { mediaType, error })
    }
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {object} params
   * @param {import('../constants/media').MediaType} params.mediaType
   * @param {string} params.id
   * @return {Promise<void>}
   */
  async [FETCH_MEDIA_ITEM]({ commit, dispatch, state, rootState }, params) {
    const { mediaType, id } = params
    const resultRank = Object.keys(state.results[mediaType].items).findIndex(
      (item) => item === id
    )
    await dispatch(
      `${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`,
      {
        query: rootState.search.query.q,
        resultUuid: id,
        resultRank,
        sessionId: rootState.user.usageSessionId,
      },
      { root: true }
    )
    commit(SET_MEDIA_ITEM, { item: {}, mediaType })
    try {
      const data = await services[mediaType].getMediaDetail(params)
      commit(SET_MEDIA_ITEM, { item: data, mediaType })
    } catch (error) {
      if (error.response && error.response.status === 404) {
        commit(MEDIA_NOT_FOUND, { mediaType })
      } else {
        await dispatch(HANDLE_MEDIA_ERROR, { mediaType, error })
      }
    }
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {object} payload
   * @param {import('./types').SupportedMediaType} payload.mediaType
   * @param {unknown} payload.error
   * @return {Promise<void>}
   */
  async [HANDLE_MEDIA_ERROR]({ commit }, { mediaType, error }) {
    let errorMessage
    if (error.response) {
      errorMessage =
        error.response.status === 500
          ? 'There was a problem with our servers'
          : error.response.message
      commit(FETCH_MEDIA_ERROR, { mediaType, errorMessage })
    } else {
      commit(FETCH_MEDIA_ERROR, { mediaType, errorMessage: error.message })
      throw new Error(error)
    }
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {number} mediaCount
   * @param {import('./types').SupportedMediaType} mediaType
   */
  [HANDLE_NO_MEDIA]({ commit }, { mediaCount, mediaType }) {
    if (!mediaCount) {
      commit(FETCH_MEDIA_ERROR, {
        mediaType,
        errorMessage: `No ${mediaType} found for this query`,
      })
    }
  },
})
const actions = createActions()

export const getters = {
  /**
   * Returns an array of media types that correspond to the selected search type. For 'All content',
   * returns all supported media, for other media type - an array with a single item.
   * @param state
   * @param getters
   * @returns {('image'|'audio'|'video')[]}
   */
  currentMediaTypes(state, getters) {
    return getters.searchType === ALL_MEDIA
      ? [IMAGE, AUDIO]
      : [getters.searchType]
  },
  /**
   * For use in the VContentLink: returns the object with media type and corresponding result count.
   * @param state
   * @param getters
   * @returns {{[ key: 'audio'|'image'|'video']: number}}
   */
  mediaTypeResultCounts(state, getters) {
    // TODO: remove Object.values after converting items to an array
    return getters.currentMediaTypes.reduce(
      (acc, mediaType) => ({
        ...acc,
        [mediaType]: state.results[mediaType].count,
      }),
      {}
    )
  },
  searchResultItems(state, getters) {
    // TODO: remove Object.values after converting items to an array
    return getters.currentMediaTypes.reduce(
      (acc, mediaType) => ({
        ...acc,
        [mediaType]: Object.values(state.results[mediaType].items),
      }),
      {}
    )
  },
  totalResultsCount(state, getters) {
    if (getters.searchType === ALL_MEDIA) {
      /**
       * API returns 10 000 if there are more than 10 000 results,
       * Count for all media also returns at most 10 000.
       */
      const count = supportedMediaTypes
        .map((type) => state.results[type].count)
        .reduce((a, b) => a + b, 0)
      return count > 10000 ? 10000 : count
    } else {
      return state.results[getters.searchType]?.count || 0
    }
  },
  /**
   * Search fetching state for selected media type.
   * @param {import('./types').MediaState} state
   * @param getters
   * @returns {import('./types').fetchState}
   */
  fetchState(state, getters) {
    if (getters.searchType === ALL_MEDIA) {
      return {
        isFetching:
          state.mediaFetchState[AUDIO].isFetching ||
          state.mediaFetchState[IMAGE].isFetching,
        fetchError:
          state.mediaFetchState[AUDIO].fetchError ||
          state.mediaFetchState[IMAGE].fetchError,
        isFinished:
          state.mediaFetchState[AUDIO].isFinished &&
          state.mediaFetchState[IMAGE].isFinished,
      }
    } else {
      return (
        state.mediaFetchState[getters.searchType] || {
          isFetching: false,
          fetchError: false,
          isFinished: true,
        }
      )
    }
  },
  /**
   * Returns the currently selected search type. This can include 'All Content', as well as the media types.
   * @param state
   * @param getters
   * @param rootState
   * @returns {'audio'|'image'|'all'|'video'}
   */
  searchType(state, getters, rootState) {
    return rootState.search.searchType
  },
  getAudioById: (state) => (id) => {
    // TODO: use find after converting items to an array
    return state.results.audio.items[id]
    // return state.results.audio.items.find((item) => item.id === id)
  },
}

export const mutations = {
  /**
   * Sets the fetchState for all passed mediaTypes at the beginning of fetching.
   * @param _state
   * @param {import('./types').MediaType} mediaType
   */
  [FETCH_START_MEDIA](_state, { mediaType }) {
    _state.mediaFetchState[mediaType].isFetching = true
    _state.mediaFetchState[mediaType].fetchingError = null
    _state.mediaFetchState[mediaType].isFinished = false
  },
  /**
   * Sets the fetchState.isFetching to false for all passed mediaTypes at the end of fetching.
   * @param _state
   * @param {object} params
   * @param {import('./types').MediaType} params.mediaType
   */
  [FETCH_END_MEDIA](_state, { mediaType }) {
    _state.mediaFetchState[mediaType].isFetching = false
  },
  [FETCH_MEDIA_ERROR](_state, params) {
    const { mediaType, errorMessage } = params
    _state.mediaFetchState[mediaType].isFetching = false
    _state.mediaFetchState[mediaType].fetchingError = errorMessage
    _state.mediaFetchState[mediaType].isFinished = true
  },
  [SET_MEDIA_ITEM](_state, params) {
    const { item, mediaType } = params
    _state[mediaType] = item
  },
  [SET_MEDIA](_state, params) {
    const {
      mediaType,
      media,
      mediaCount,
      page,
      pageCount,
      shouldPersistMedia,
    } = params
    let mediaToSet
    if (shouldPersistMedia) {
      mediaToSet = { ..._state.results[mediaType].items, ...media }
    } else {
      mediaToSet = media
    }
    const mediaPage = page || 1
    _state.results[mediaType].items = mediaToSet
    _state.results[mediaType].count = mediaCount || 0
    _state.results[mediaType].page = mediaPage
    _state.results[mediaType].pageCount = pageCount
    _state.mediaFetchState[mediaType].isFinished = mediaPage >= pageCount
  },
  [MEDIA_NOT_FOUND](_state, params) {
    throw new Error(`Media of type ${params.mediaType} not found`)
  },
  /**
   * Clears the items for all passed media types, and resets fetch state.
   * @param _state
   * @param {import('./types').MediaType} mediaType
   */
  [RESET_MEDIA](_state, { mediaType }) {
    _state.results[mediaType].items = {}
    _state.results[mediaType].count = 0
    _state.results[mediaType].page = undefined
    _state.results[mediaType].pageCount = 0
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
