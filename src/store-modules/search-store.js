import isEmpty from 'lodash.isempty'
import findIndex from 'lodash.findindex'
import prepareSearchQueryParams from '~/utils/prepare-search-query-params'
import decodeMediaData from '~/utils/decode-media-data'
import {
  FETCH_MEDIA,
  FETCH_AUDIO,
  FETCH_IMAGE,
  FETCH_COLLECTION_IMAGES,
  HANDLE_NO_MEDIA,
  HANDLE_MEDIA_ERROR,
  UPDATE_SEARCH_TYPE,
  SET_SEARCH_TYPE_FROM_URL,
} from '~/constants/action-types'
import {
  FETCH_END_MEDIA,
  FETCH_MEDIA_ERROR,
  FETCH_START_MEDIA,
  MEDIA_NOT_FOUND,
  SET_AUDIO,
  SET_IMAGE,
  SET_IMAGE_PAGE,
  SET_MEDIA,
  SET_QUERY,
  SET_SEARCH_TYPE,
  UPDATE_FILTERS,
} from '~/constants/mutation-types'
import {
  SEND_SEARCH_QUERY_EVENT,
  SEND_RESULT_CLICKED_EVENT,
} from '~/constants/usage-data-analytics-types'
import { queryStringToSearchType } from '~/utils/search-query-transform'
import { ALL_MEDIA, AUDIO, IMAGE } from '~/constants/media'
import { USAGE_DATA } from '~/constants/store-modules'

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
 * @param {import('../store/types').MediaResult} data
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

/**
 * @type {{ audios: import('../store/types').AudioDetail[],
 * audiosCount: number, audioPage:number,
 * images: import('../store/types').ImageDetail[],
 * imagePage: number, imagesCount: number, query: {},
 * pageCount: {images: number, audios: number},
 * isFetching: {images: boolean, audios: boolean},
 * isFetchingError: {images: boolean, audios: boolean},
 * errorMessage: null, searchType: string, }}
 */
const state = {
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
}

/**
 * @param {Object} AudioService
 * @param {Object} ImageService
 */
const actions = (AudioService, ImageService) => ({
  [FETCH_MEDIA]({ commit, dispatch, rootState }, params) {
    // does not send event if user is paginating for more results
    const { page, mediaType, q } = params
    if (!page) {
      dispatch(`${USAGE_DATA}/${SEND_SEARCH_QUERY_EVENT}`, {
        query: q,
        sessionId: rootState.user.usageSessionId,
      })
    }

    commit(FETCH_START_MEDIA, { mediaType })
    hideSearchResultsOnNewSearch(commit, page)
    const queryParams = prepareSearchQueryParams(params)
    let service
    if (mediaType === IMAGE) {
      service = ImageService
    } else if (mediaType === AUDIO) {
      service = AudioService
    } else {
      throw new Error(`Cannot fetch unknown media type "${mediaType}"`)
    }
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
  [FETCH_AUDIO]({ commit, dispatch, state, rootState }, params) {
    dispatch(`${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`, {
      query: state.query.q,
      resultUuid: params.id,
      resultRank: findIndex(state.audios, (img) => img.id === params.id),
      sessionId: rootState.usageSessionId,
    })

    commit(FETCH_START_MEDIA, { mediaType: AUDIO })
    commit(SET_AUDIO, { audio: {} })
    return AudioService.getMediaDetail(params)
      .then(({ data }) => {
        commit(FETCH_END_MEDIA, { mediaType: AUDIO })
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
  // eslint-disable-next-line no-unused-vars
  [FETCH_IMAGE]({ commit, dispatch, state, rootState }, params) {
    dispatch(`${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`, {
      query: state.query.q,
      resultUuid: params.id,
      resultRank: findIndex(state.images, (img) => img.id === params.id),
      sessionId: rootState.user.usageSessionId,
    })

    commit(SET_IMAGE, { image: {} })
    return ImageService.getMediaDetail(params)
      .then(({ data }) => {
        commit(SET_IMAGE, { image: data })
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          commit(MEDIA_NOT_FOUND, { mediaType: IMAGE })
        } else {
          throw new Error(`Error fetching the image: ${error}`)
        }
      })
  },
  [FETCH_COLLECTION_IMAGES]({ commit, dispatch }, params) {
    commit(FETCH_START_MEDIA, { mediaType: IMAGE })
    return fetchCollectionImages(commit, params, ImageService)
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
  [SET_SEARCH_TYPE_FROM_URL]({ commit }, params) {
    commit(SET_SEARCH_TYPE, { searchType: queryStringToSearchType(params.url) })
    commit(UPDATE_FILTERS)
  },
  [UPDATE_SEARCH_TYPE]({ commit }, params) {
    commit(SET_SEARCH_TYPE, { searchType: params.searchType })
    commit(UPDATE_FILTERS)
  },
})

function setQuery(_state, params) {
  const query = Object.assign({}, _state.query, params.query)
  _state.query = query
  _state.images = []

  // if (params.shouldNavigate === true) {
  //   redirect({ path, query })
  // }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
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
    setQuery(_state, params)
  },
  [MEDIA_NOT_FOUND](params) {
    throw new Error(`Media of type ${params.mediaType} not found`)
  },
  [SET_SEARCH_TYPE](_state, params) {
    _state.searchType = params.searchType
  },
}

export default {
  state,
  actions,
  mutations,
}
