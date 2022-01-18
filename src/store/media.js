import findIndex from 'lodash.findindex'
import prepareSearchQueryParams from '~/utils/prepare-search-query-params'
import decodeMediaData from '~/utils/decode-media-data'
import {
  FETCH_AUDIO,
  FETCH_IMAGE,
  FETCH_MEDIA,
  HANDLE_MEDIA_ERROR,
  HANDLE_NO_MEDIA,
} from '~/constants/action-types'
import {
  FETCH_END_MEDIA,
  FETCH_MEDIA_ERROR,
  FETCH_START_MEDIA,
  MEDIA_NOT_FOUND,
  RESET_MEDIA,
  SET_AUDIO,
  SET_IMAGE,
  SET_MEDIA,
} from '~/constants/mutation-types'
import {
  SEND_RESULT_CLICKED_EVENT,
  SEND_SEARCH_QUERY_EVENT,
} from '~/constants/usage-data-analytics-types'
import { AUDIO, IMAGE, VIDEO, ALL_MEDIA } from '~/constants/media'
import { USAGE_DATA } from '~/constants/store-modules'
import AudioService from '~/data/audio-service'
import ImageService from '~/data/image-service'

// Note: images should always be first here,
// and this only includes 'real' media. ALL is a
// special case not used in this list.
const supportedTypes = [IMAGE, AUDIO]

/**
 * @return {import('./types').MediaState}
 */
export const state = () => ({
  supportedTypes,
  results: {
    [ALL_MEDIA]: {
      count: 0,
      page: undefined,
      pageCount: 0,
      items: {},
    },
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
  fetchState: {
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
    all: {
      isFetching: false,
      fetchingError: null,
      isFinished: false,
    },
  },
  audio: {},
  image: {},
})

export const createActions = (services) => ({
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {Object} payload
   * @param {number} [payload.page] - API page to load.
   * @param {boolean} [payload.shouldPersistMedia] - whether the existing media
   * should be added to or replaced.
   * @return {Promise<void>}
   */
  async [FETCH_MEDIA](
    { commit, dispatch, rootState, rootGetters },
    payload = {}
  ) {
    const { page = undefined, shouldPersistMedia = false } = payload

    const queryParams = prepareSearchQueryParams({
      ...rootGetters['search/searchQueryParams'],
      ...payload,
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
    const mediaType = rootState.search.query.mediaType

    commit(FETCH_START_MEDIA, { mediaType })
    if (!page) {
      commit(RESET_MEDIA, { mediaType })
    }

    const mediaToFetch = mediaType !== ALL_MEDIA ? [mediaType] : supportedTypes

    await Promise.all(
      mediaToFetch.map((type) => services[type].search(queryParams))
    )
      .then((res) => {
        commit(FETCH_END_MEDIA, { mediaType })
        return res.map(({ data }, index) =>
          services[mediaToFetch[index]].transformResults(data)
        )
      })
      .then((dataList) => {
        // Call SET_MEDIA for each media type.
        dataList.forEach((data, index) => {
          const mediaCount = data.result_count
          commit(SET_MEDIA, {
            mediaType: mediaToFetch[index],
            media: data.results,
            mediaCount,
            pageCount: data.page_count,
            shouldPersistMedia,
            page,
          })
          dispatch(HANDLE_NO_MEDIA, {
            mediaType: mediaToFetch[index],
            mediaCount,
          })
        })
        // If fetching all media, set 'all' to an aggregate of the other collected results
        if (mediaType === ALL_MEDIA) {
          const mediaCount = dataList.reduce(
            (acc, data) => acc + data.result_count,
            0
          )
          commit(SET_MEDIA, {
            mediaType: ALL_MEDIA,
            // todo: Instead of storing this object of all media, keyed by media type,
            // and having duplicated results in memory, we should do...something else!
            media: dataList.reduce(
              (acc, data, index) => ({
                ...acc,
                [mediaToFetch[index]]: data.results,
              }),
              0
            ),
            mediaCount,
            shouldPersistMedia: true,
          })
          dispatch(HANDLE_NO_MEDIA, {
            mediaType: ALL_MEDIA,
            mediaCount,
          })
        }
      })
      .catch((error) => {
        dispatch(HANDLE_MEDIA_ERROR, { mediaType, error })
      })
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param params
   * @return {Promise<void>}
   */
  async [FETCH_AUDIO]({ commit, dispatch, state, rootState }, params) {
    await dispatch(
      `${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`,
      {
        query: rootState.search.query.q,
        resultUuid: params.id,
        resultRank: findIndex(
          state.results.audio.items,
          (item) => item.id === params.id
        ),
        sessionId: rootState.user.usageSessionId,
      },
      { root: true }
    )
    commit(SET_AUDIO, { audio: {} })
    await services[AUDIO].getMediaDetail(params)
      .then(({ data }) => {
        commit(SET_AUDIO, { audio: data })
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          commit(MEDIA_NOT_FOUND, { mediaType: AUDIO })
        } else {
          dispatch(HANDLE_MEDIA_ERROR, { mediaType: AUDIO, error })
        }
      })
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param params
   * @return {Promise<void>}
   */
  async [FETCH_IMAGE]({ commit, dispatch, state, rootState }, params) {
    await dispatch(
      `${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`,
      {
        query: rootState.search.query.q,
        resultUuid: params.id,
        resultRank: findIndex(
          state.results.image.items,
          (img) => img.id === params.id
        ),
        sessionId: rootState.user.usageSessionId,
      },
      { root: true }
    )

    commit(SET_IMAGE, { image: {} })
    await services[IMAGE].getMediaDetail(params)
      .then(({ data }) => {
        commit(SET_IMAGE, { image: data })
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          commit(MEDIA_NOT_FOUND, { mediaType: IMAGE })
        } else {
          throw new Error(`Error fetching the image: ${error.message}`)
        }
      })
  },
  /**
   *
   * @param {import('vuex').ActionContext} context
   * @param {'audio'|'image'} mediaType
   * @param error
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
   * @param {'audio'|'image'} mediaType
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

export const getters = {
  /**
   * Returns the search result data related for selected media.
   * @param {import('./types').MediaState} state
   * @param getters
   * @return {import('./types').MediaStoreResult}
   */
  results(state, getters) {
    return getters.mediaType ? state.results[getters.mediaType] : {}
  },
  /**
   * Search fetching state for selected media type.
   * @param {import('./types').MediaState} state
   * @param getters
   * @returns {import('./types').fetchState}
   */
  fetchState(state, getters) {
    return (
      state.fetchState[getters.mediaType] || {
        isFetching: false,
        fetchError: false,
        isFinished: true,
      }
    )
  },
  mediaType(state, getters, rootState) {
    return rootState.search.query.mediaType
  },
  /**
   * Returns true for media types that are not supported in the API: video and currently audio.
   *
   * @param state
   * @param getters
   * @param rootState
   * @returns {boolean}
   */
  unsupportedMediaType(state, getters, rootState) {
    const mediaType = rootState.search.searchType
    return (
      mediaType === VIDEO || (mediaType === AUDIO && !process.env.enableAudio)
    )
  },
}

export const mutations = {
  [FETCH_START_MEDIA](_state, { mediaType }) {
    const mediaTypes =
      mediaType !== ALL_MEDIA ? [mediaType] : _state.supportedTypes
    for (const mType of mediaTypes) {
      _state.fetchState[mType].isFetching = true
      _state.fetchState[mType].fetchingError = null
      _state.fetchState[mType].isFinished = false
    }
  },
  [FETCH_END_MEDIA](_state, { mediaType }) {
    const mediaTypes =
      mediaType !== ALL_MEDIA ? [mediaType] : _state.supportedTypes
    for (const mType of mediaTypes) {
      _state.fetchState[mType].isFetching = false
    }
  },
  [FETCH_MEDIA_ERROR](_state, params) {
    const { mediaType, errorMessage } = params
    const mediaTypes =
      mediaType !== ALL_MEDIA ? [mediaType] : _state.supportedTypes
    for (const mType of mediaTypes) {
      _state.fetchState[mType].isFetching = false
      _state.fetchState[mType].fetchingError = errorMessage
      _state.fetchState[mType].isFinished = true
    }
  },
  [SET_AUDIO](_state, params) {
    _state.audio = decodeMediaData(params.audio, AUDIO)
  },
  [SET_IMAGE](_state, params) {
    _state.image = decodeMediaData(params.image)
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
    _state.fetchState[mediaType].isFinished = mediaPage >= pageCount
  },
  [MEDIA_NOT_FOUND](_state, params) {
    throw new Error(`Media of type ${params.mediaType} not found`)
  },
  [RESET_MEDIA](_state, params) {
    let mediaTypes
    if (params && params.mediaType) {
      mediaTypes = [params.mediaType]
    } else {
      mediaTypes = [AUDIO, IMAGE]
    }
    mediaTypes.forEach((mediaType) => {
      _state.results[mediaType].items = []
      _state.results[mediaType].count = 0
      _state.results[mediaType].page = undefined
      _state.results[mediaType].pageCount = 0
    })
  },
}

const mediaServices = { [AUDIO]: AudioService, [IMAGE]: ImageService }
const actions = createActions(mediaServices)

export default {
  state,
  getters,
  actions,
  mutations,
}
