// @ts-check
import isEmpty from 'lodash.isempty'
import findIndex from 'lodash.findindex'
import prepareSearchQueryParams from '~/utils/prepare-search-query-params'
import decodeMediaData from '~/utils/decode-media-data'
import AudioService from '~/data/audio-service'
import ImageService from '~/data/image-service'
import {
  FETCH_COLLECTION_IMAGES,
  FETCH_IMAGE,
  FETCH_MEDIA,
  HANDLE_MEDIA_ERROR,
  HANDLE_NO_MEDIA,
  SET_QUERY_FROM_FILTERS_DATA,
  SET_SEARCH_TYPE_FROM_URL,
  UPDATE_SEARCH_TYPE,
} from '~/constants/action-types'
import {
  FETCH_END_MEDIA,
  FETCH_MEDIA_ERROR,
  FETCH_START_MEDIA,
  IMAGE_NOT_FOUND,
  SET_AUDIO,
  SET_IMAGE,
  SET_IMAGE_PAGE,
  SET_MEDIA,
  SET_QUERY,
  SET_SEARCH_TYPE,
  UPDATE_FILTERS,
} from '~/constants/mutation-types'
import {
  SEND_RESULT_CLICKED_EVENT,
  SEND_SEARCH_QUERY_EVENT,
} from '~/store/usage-data-analytics-types'
import {
  filtersToQueryData,
  queryStringToSearchType,
} from '~/utils/search-query-transform'
import { ALL_MEDIA, AUDIO, IMAGE } from '~/constants/media'
import { FILTER, USAGE_DATA } from '~/constants/store-modules'

// const getSearchPath = () =>
//   window.location.pathname && window.location.pathname.includes('search')
//     ? window.location.pathname
//     : '/search'

/**
 * hides the search results in case the user is performing a new search.
 * This prevents results from a previous search from showing while the
 * new search results are still loading
 */
const hideSearchResultsOnNewSearch = (commit, pageNumber) => {
  if (!pageNumber) {
    commit(SET_MEDIA, { mediaType: IMAGE, media: [] })
    commit(SET_MEDIA, { mediaType: AUDIO, media: [] })
  }
}

const allKeysUndefinedExcept = (value, keyName) => {
  const keys = Object.keys(value)
  return keys.reduce((matchedUndefinedCriteria, key) => {
    const shouldBeUndefined = key !== keyName
    const isUndefined = isEmpty(value[key])

    return matchedUndefinedCriteria && shouldBeUndefined === isUndefined
  }, true)
}

const fetchCollectionImages = (commit, params, imageService) => {
  hideSearchResultsOnNewSearch(commit, params.page)

  const queryParams = {
    q: params.q,
    provider: params.provider,
    searchBy: params.searchBy,
  }
  // the provider collection API doesn't support the `q` parameter.
  // so if the `q`, or any other search filter is provided, and
  // since the `provider` parameter is passed, we can just call the search API instead
  const searchMethod = allKeysUndefinedExcept(queryParams, 'provider')
    ? imageService.getProviderCollection
    : imageService.search
  const newParams = { ...params, source: params.provider }
  delete newParams.provider
  return searchMethod(prepareSearchQueryParams(newParams))
}

/**
 * With the API response: set loading to false, set the
 * store `images` or `audios` property to the result,
 * and handle possible errors
 * @param {import('vuex').Commit} commit
 * @param {import('vuex').Dispatch} dispatch
 * @param {import('./types').MediaResult} data
 * @param {Object} params
 * @param {'image'|'audio'} params.mediaType
 * @param {boolean} params.shouldPersistMedia
 * @param {number} params.page
 */
const handleSearchResponse = async (
  commit,
  dispatch,
  data,
  { mediaType, shouldPersistMedia, page }
) => {
  commit(FETCH_END_MEDIA, { mediaType })
  commit(SET_MEDIA, {
    mediaType,
    media: data.results,
    mediaCount: data.result_count,
    pageCount: data.page_count,
    shouldPersistMedia: shouldPersistMedia,
    page: page,
  })
  return dispatch(HANDLE_NO_MEDIA, mediaType)
}

export const state = () => ({
  image: {},
  audio: {},
  audios: [],
  audiosCount: 0,
  audioPage: 1,
  images: [],
  imagesCount: 0,
  imagePage: 1,
  pageCount: {
    images: 0,
    audios: 0,
  },
  isFetching: {
    audios: false,
    images: false,
  },
  isFetchingError: {
    audios: true,
    images: true,
  },
  errorMessage: null,
  searchType: ALL_MEDIA,
  query: {},
})

const services = {
  AUDIO: AudioService,
  IMAGE: ImageService,
}
export const actionsCreator = (services) => ({
  [FETCH_MEDIA]({ commit, dispatch, state }, params) {
    // does not send event if user is paginating for more results
    const { page, mediaType, q } = params
    if (!page) {
      dispatch(
        `${USAGE_DATA}/${SEND_SEARCH_QUERY_EVENT}`,
        {
          query: q,
          sessionId: state.usageSessionId,
        },
        { root: true }
      )
    }

    commit(FETCH_START_MEDIA, { mediaType })
    hideSearchResultsOnNewSearch(commit, page)
    const queryParams = prepareSearchQueryParams(params)
    if (!Object.keys(services).includes(mediaType)) {
      throw new Error(`Unsupported media type ${mediaType} for fetch_media`)
    }
    const service = services[mediaType]
    return service
      .search(queryParams)
      .then(
        async ({ data }) =>
          await handleSearchResponse(commit, dispatch, data, params)
      )
      .catch((error) => {
        dispatch(HANDLE_MEDIA_ERROR, { mediaType, error })
      })
  },
  // eslint-disable-next-line no-unused-vars
  [FETCH_IMAGE]({ commit, dispatch, state }, params) {
    dispatch(
      `${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`,
      {
        query: state.query.q,
        resultUuid: params.id,
        resultRank: findIndex(state.images, (img) => img.id === params.id),
        sessionId: state.usageSessionId,
      },
      { root: true }
    )

    commit(FETCH_START_MEDIA, { mediaType: IMAGE })
    commit(SET_IMAGE, { image: {} })
    return services[IMAGE].getMediaDetail(params)
      .then(({ data }) => {
        commit(FETCH_END_MEDIA, { mediaType: IMAGE })
        commit(SET_IMAGE, { image: data })
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          commit(IMAGE_NOT_FOUND)
        } else {
          dispatch(HANDLE_MEDIA_ERROR, { mediaType: IMAGE, error })
        }
      })
  },
  [FETCH_COLLECTION_IMAGES]({ commit, dispatch }, params) {
    commit(FETCH_START_MEDIA, { mediaType: IMAGE })
    return fetchCollectionImages(commit, params, services[IMAGE])
      .then(
        async ({ data }) =>
          await handleSearchResponse(commit, dispatch, data, params)
      )
      .catch((error) => {
        dispatch(HANDLE_MEDIA_ERROR, { mediaType: IMAGE, error })
      })
  },
  [HANDLE_MEDIA_ERROR]({ commit }, { mediaType, error }) {
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
  [HANDLE_NO_MEDIA]({ commit }, { mediaCount, mediaType }) {
    if (!mediaCount) {
      commit(FETCH_MEDIA_ERROR, {
        errorMessage: `No ${mediaType} found for this query`,
      })
    }
  },
  [SET_SEARCH_TYPE_FROM_URL]({ commit, dispatch }, params) {
    commit(SET_SEARCH_TYPE, { searchType: queryStringToSearchType(params.url) })
    dispatch(`${FILTER}/${UPDATE_FILTERS}`, {}, { root: true })
  },
  [UPDATE_SEARCH_TYPE]({ commit, dispatch }, params) {
    commit(SET_SEARCH_TYPE, { searchType: params.searchType })
    dispatch(`${FILTER}/${UPDATE_FILTERS}`, {}, { root: true })
  },
  [SET_QUERY_FROM_FILTERS_DATA]({ commit, state }, params) {
    const { filters } = params
    const filtersQuery = filtersToQueryData(filters, state.searchType)
    commit(SET_QUERY, { query: filtersQuery })
  },
})

export const actions = actionsCreator(services)
/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [FETCH_START_MEDIA](_state, { mediaType }) {
    if (mediaType === IMAGE) {
      _state.isFetching.images = true
      _state.isFetchingError.images = false
    } else if (mediaType === AUDIO) {
      _state.isFetching.audios = true
      _state.isFetchingError.audios = false
    }
  },
  [FETCH_END_MEDIA](_state, { mediaType }) {
    mediaType === IMAGE
      ? (_state.isFetching.images = false)
      : (_state.isFetching.audios = false)
  },
  [FETCH_MEDIA_ERROR](_state, params) {
    const { mediaType, errorMessage } = params
    if (mediaType === IMAGE) {
      _state.isFetchingError.images = true
      _state.isFetching.images = false
    } else if (mediaType === AUDIO) {
      _state.isFetchingError.audios = true
      _state.isFetching.audios = false
    }
    _state.errorMessage = errorMessage
  },
  [SET_AUDIO](_state, params) {
    _state.audio = decodeMediaData(params.audio, AUDIO)
  },
  [SET_IMAGE](_state, params) {
    _state.image = decodeMediaData(params.image)
  },
  [SET_IMAGE_PAGE](_state, params) {
    _state.imagePage = params.imagePage
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
    const mediaPlural = `${mediaType}s`
    let mediaToSet
    if (shouldPersistMedia) {
      mediaToSet = _state[`${mediaType}s`].concat(media)
    } else {
      mediaToSet = media
    }
    mediaToSet = mediaToSet.map((item) => decodeMediaData(item))
    _state[mediaPlural] = mediaToSet
    _state[`${mediaPlural}Count`] = mediaCount || 0
    _state[`${mediaType}Page`] = page || 1
    _state.pageCount[mediaPlural] = pageCount
  },
  [SET_QUERY](_state, params) {
    _state.query = Object.assign({}, _state.query, params.query)
    _state.images = []

    // if (params.shouldNavigate === true) {
    //   redirect({ path, query })
    // }
  },
  [IMAGE_NOT_FOUND]() {
    throw new Error('Image not found')
  },
  [SET_SEARCH_TYPE](_state, params) {
    _state.searchType = params.searchType
  },
}

export default {
  state,
  mutations,
  actions,
}
