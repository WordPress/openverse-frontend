import store, { createActions } from '~/store/media'
import {
  FETCH_END_MEDIA,
  FETCH_MEDIA_ERROR,
  FETCH_START_MEDIA,
  MEDIA_NOT_FOUND,
  RESET_MEDIA,
  SET_AUDIO,
  SET_IMAGE,
  SET_IMAGE_PAGE,
  SET_MEDIA,
} from '~/constants/mutation-types'
import {
  FETCH_AUDIO,
  FETCH_IMAGE,
  FETCH_MEDIA,
  HANDLE_MEDIA_ERROR,
  HANDLE_NO_MEDIA,
} from '~/constants/action-types'
import { AUDIO, IMAGE } from '~/constants/media'
import {
  SEND_RESULT_CLICKED_EVENT,
  SEND_SEARCH_QUERY_EVENT,
} from '~/constants/usage-data-analytics-types'
import { USAGE_DATA } from '~/constants/store-modules'

describe('Search Store', () => {
  describe('state', () => {
    it('exports default state', () => {
      const state = store.state()
      expect(state.audios).toHaveLength(0)
      expect(state.audiosCount).toBe(0)
      expect(state.audioPage).toBe(1)
      expect(state.images).toHaveLength(0)
      expect(state.imagesCount).toBe(0)
      expect(state.imagePage).toBe(1)
      expect(state.pageCount.audios).toBe(0)
      expect(state.pageCount.images).toBe(0)
      expect(state.isFetching.audios).toBeFalsy()
      expect(state.isFetching.images).toBeFalsy()
      expect(state.isFetchingError.audios).toBeTruthy()
      expect(state.isFetchingError.images).toBeTruthy()
      expect(state.errorMessage).toBe(null)
    })
  })

  describe('mutations', () => {
    let state = null
    const mutations = store.mutations

    beforeEach(() => {
      state = store.state()
    })

    it('FETCH_START_MEDIA updates state', () => {
      mutations[FETCH_START_MEDIA](state, { mediaType: IMAGE })

      expect(state.isFetching.images).toBeTruthy()
      expect(state.isFetchingError.images).toBeFalsy()
    })

    it('FETCH_END_MEDIA updates state', () => {
      mutations[FETCH_END_MEDIA](state, { mediaType: IMAGE })

      expect(state.isFetching.images).toBeFalsy()
    })

    it('FETCH_MEDIA_ERROR updates state', () => {
      mutations[FETCH_MEDIA_ERROR](state, {
        mediaType: IMAGE,
        errorMessage: 'error',
      })

      expect(state.isFetching.images).toBeFalsy()
      expect(state.isFetchingError.images).toBeTruthy()
      expect(state.errorMessage).toBe('error')
    })

    it('SET_AUDIO updates state', () => {
      const params = { audio: { title: 'Foo', creator: 'bar', tags: [] } }
      mutations[SET_AUDIO](state, params)

      expect(state.audio).toEqual(params.audio)
    })

    it('SET_IMAGE updates state', () => {
      const params = { image: { title: 'Foo', creator: 'bar', tags: [] } }
      mutations[SET_IMAGE](state, params)

      expect(state.image).toEqual(params.image)
    })

    it('SET_IMAGE_PAGE updates state', () => {
      const params = { imagePage: 1 }
      mutations[SET_IMAGE_PAGE](state, params)

      expect(state.imagePage).toBe(params.imagePage)
    })

    it('SET_MEDIA updates state persisting images', () => {
      const img1 = { title: 'Foo', creator: 'foo', tags: [] }
      const img2 = { title: 'Bar', creator: 'bar', tags: [] }
      state.images = [img1]
      const params = {
        media: [img2],
        mediaCount: 2,
        page: 2,
        shouldPersistMedia: true,
        mediaType: IMAGE,
      }
      mutations[SET_MEDIA](state, params)

      expect(state.images).toEqual([img1, img2])
      expect(state.imagesCount).toBe(params.mediaCount)
      expect(state.imagePage).toBe(params.page)
    })

    it('SET_MEDIA updates state not persisting images', () => {
      const img = { title: 'Foo', creator: 'bar', tags: [] }
      state.images = ['img1']
      const params = {
        media: [img],
        mediaCount: 2,
        page: 2,
        shouldPersistMedia: false,
        mediaType: IMAGE,
      }
      mutations[SET_MEDIA](state, params)

      expect(state.images).toEqual([img])
      expect(state.imagesCount).toBe(params.mediaCount)
      expect(state.imagePage).toBe(params.page)
    })

    it('SET_MEDIA updates state with default count and page', () => {
      const img = { title: 'Foo', creator: 'bar', tags: [] }
      state.images = ['img1']
      const params = { media: [img], mediaType: IMAGE }
      mutations[SET_MEDIA](state, params)

      expect(state.imagesCount).toBe(0)
      expect(state.imagePage).toBe(1)
    })

    it('MEDIA_NOT_FOUND throws an error', () => {
      expect(() =>
        mutations[MEDIA_NOT_FOUND](state, { mediaType: AUDIO })
      ).toThrow('Media of type audio not found')
    })

    it('RESET_MEDIA resets the media type state', () => {
      state = {
        images: [{ id: 'image1' }, { id: 'image2' }],
        imagePage: 2,
        imagesCount: 200,
        pageCount: {
          images: 2,
        },
      }

      mutations[RESET_MEDIA](state, { mediaType: IMAGE })
      expect(state.images).toStrictEqual([])
      expect(state.imagesCount).toEqual(0)
      expect(state.imagePage).toBe(undefined)
      expect(state.pageCount.images).toEqual(0)
    })
  })

  describe('actions', () => {
    const searchData = { results: ['foo'], result_count: 1 }
    const audioDetailData = 'audioDetails'
    const imageDetailData = 'imageDetails'
    let services = null
    let audioServiceMock = null
    let imageServiceMock = null
    let state
    let context
    beforeEach(() => {
      imageServiceMock = {
        search: jest.fn(() => Promise.resolve({ data: searchData })),
        getProviderCollection: jest.fn(() =>
          Promise.resolve({ data: searchData })
        ),
        getMediaDetail: jest.fn(() =>
          Promise.resolve({ data: imageDetailData })
        ),
      }
      audioServiceMock = {
        search: jest.fn(() => Promise.resolve({ data: searchData })),
        getProviderCollection: jest.fn(() =>
          Promise.resolve({ data: searchData })
        ),
        getMediaDetail: jest.fn(() =>
          Promise.resolve({ data: audioDetailData })
        ),
      }
      services = { [AUDIO]: audioServiceMock, [IMAGE]: imageServiceMock }
      state = {
        audios: [{ id: 'foo' }, { id: 'bar' }, { id: 'zeta' }],
        images: [{ id: 'foo' }, { id: 'bar' }, { id: 'zeta' }],
        query: { q: 'foo query' },
      }

      context = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        rootState: { user: { usageSessionId: 'foo' } },
        state: state,
      }
    })

    it('FETCH_MEDIA throws an error on unknown media type', async () => {
      const action = createActions(services)[FETCH_MEDIA]
      const params = {
        mediaType: 'unknown',
        page: 1,
      }
      await expect(action(context, params)).rejects.toThrow(
        'Cannot fetch unknown media type "unknown"'
      )
    })

    it('FETCH_MEDIA on success', async () => {
      const params = {
        q: 'foo',
        page: 1,
        shouldPersistMedia: false,
        mediaType: IMAGE,
      }
      const action = createActions(services)[FETCH_MEDIA]
      await action(context, params)
      expect(context.commit).toHaveBeenCalledWith(FETCH_START_MEDIA, {
        mediaType: IMAGE,
      })
      expect(context.commit).toHaveBeenCalledWith(FETCH_END_MEDIA, {
        mediaType: IMAGE,
      })

      expect(context.commit).toHaveBeenCalledWith(SET_MEDIA, {
        media: searchData.results,
        mediaCount: searchData.result_count,
        shouldPersistMedia: params.shouldPersistMedia,
        page: params.page,
        mediaType: IMAGE,
      })
      expect(services[IMAGE].search).toHaveBeenCalledWith(params)
    })

    it('FETCH_MEDIA dispatches SEND_SEARCH_QUERY_EVENT', async () => {
      const params = { q: 'foo', shouldPersistMedia: false, mediaType: IMAGE }
      const action = createActions(services)[FETCH_MEDIA]
      await action(context, params)

      expect(context.dispatch).toHaveBeenCalledWith(
        `${USAGE_DATA}/${SEND_SEARCH_QUERY_EVENT}`,
        {
          query: params.q,
          sessionId: context.rootState.user.usageSessionId,
        },
        { root: true }
      )
    })

    it('does not dispatch SEND_SEARCH_QUERY_EVENT if page param is available', async () => {
      const params = {
        q: 'foo',
        page: 1,
        shouldPersistMedia: false,
        mediaType: IMAGE,
      }
      const action = createActions(services)[FETCH_MEDIA]
      await action(context, params)

      expect(context.dispatch).not.toHaveBeenCalledWith(
        `${USAGE_DATA}/${SEND_SEARCH_QUERY_EVENT}`,
        {
          query: params.q,
          sessionId: context.rootState.user.usageSessionId,
        }
      )
    })

    it('FETCH_MEDIA on error', async () => {
      const mediaType = IMAGE
      services[IMAGE] = {
        search: jest.fn(() => Promise.reject('error')),
      }
      const params = {
        q: 'foo',
        page: 1,
        shouldPersistMedia: false,
        mediaType,
      }
      const action = createActions(services)[FETCH_MEDIA]
      await action(context, params)
      await expect(services[IMAGE].search).rejects.toEqual('error')

      expect(context.commit).toHaveBeenCalledWith(FETCH_START_MEDIA, {
        mediaType,
      })
      expect(context.dispatch).toHaveBeenCalledWith(HANDLE_MEDIA_ERROR, {
        error: 'error',
        mediaType,
      })
    })

    it('FETCH_MEDIA resets images if page is not defined', async () => {
      const mediaType = IMAGE
      const params = {
        q: 'foo',
        page: undefined,
        shouldPersistMedia: false,
        mediaType,
      }
      const action = createActions(services)[FETCH_MEDIA]
      await action(context, params)

      expect(context.commit).toHaveBeenCalledWith(FETCH_START_MEDIA, {
        mediaType,
      })
      expect(context.commit).toHaveBeenCalledWith(RESET_MEDIA, { mediaType })
      expect(context.commit).toHaveBeenCalledWith(FETCH_END_MEDIA, {
        mediaType,
      })
    })

    it('FETCH_MEDIA does not reset images if page is defined', async () => {
      const mediaType = IMAGE
      const params = {
        q: 'foo',
        page: 1,
        shouldPersistMedia: false,
        mediaType,
      }
      const action = createActions(services)[FETCH_MEDIA]
      await action(context, params)

      expect(context.commit).not.toHaveBeenCalledWith(RESET_MEDIA, {
        mediaType,
      })
    })

    it('FETCH_AUDIO on success', async () => {
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_AUDIO]
      await action(context, params)
      expect(context.commit).toHaveBeenCalledWith(SET_AUDIO, { audio: {} })
      expect(context.commit).toHaveBeenCalledWith(SET_AUDIO, {
        audio: audioDetailData,
      })
      expect(audioServiceMock.getMediaDetail).toHaveBeenCalledWith(params)
    })

    it('FETCH_AUDIO dispatches SEND_RESULT_CLICKED_EVENT', () => {
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_AUDIO]
      action(context, params)

      expect(context.dispatch).toHaveBeenLastCalledWith(
        `${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`,
        {
          query: state.query.q,
          resultUuid: 'foo',
          resultRank: 0,
          sessionId: context.rootState.user.usageSessionId,
        },
        { root: true }
      )
    })

    it('FETCH_AUDIO on error', async () => {
      services[AUDIO] = {
        getMediaDetail: jest.fn(() => Promise.reject('error')),
      }
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_AUDIO]
      await action(context, params)
      await expect(services[AUDIO].getMediaDetail).rejects.toEqual('error')

      expect(context.dispatch).toHaveBeenLastCalledWith(HANDLE_MEDIA_ERROR, {
        error: 'error',
        mediaType: 'audio',
      })
    })

    it('FETCH_AUDIO on 404 doesnt break and commits MEDIA_NOT_FOUND', async () => {
      const mediaType = AUDIO
      services[AUDIO] = {
        getMediaDetail: jest.fn(() =>
          Promise.reject({ response: { status: 404 } })
        ),
      }
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_AUDIO]
      await action(context, params)
      expect(context.commit).toHaveBeenCalledWith(MEDIA_NOT_FOUND, {
        mediaType,
      })
    })

    it('FETCH_IMAGE on success', async () => {
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_IMAGE]
      await action(context, params)
      expect(context.commit).toHaveBeenCalledWith(SET_IMAGE, { image: {} })
      expect(context.commit).toHaveBeenCalledWith(SET_IMAGE, {
        image: imageDetailData,
      })

      expect(imageServiceMock.getMediaDetail).toHaveBeenCalledWith(params)
    })

    it('FETCH_IMAGE dispatches SEND_RESULT_CLICKED_EVENT', () => {
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_IMAGE]
      action(context, params)

      expect(context.dispatch).toHaveBeenLastCalledWith(
        `${USAGE_DATA}/${SEND_RESULT_CLICKED_EVENT}`,
        {
          query: state.query.q,
          resultUuid: 'foo',
          resultRank: 0,
          sessionId: context.rootState.user.usageSessionId,
        },
        { root: true }
      )
    })

    it('FETCH_IMAGE on error', async () => {
      services[IMAGE] = {
        getMediaDetail: jest.fn(() =>
          Promise.reject(new Error('Server error'))
        ),
      }
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_IMAGE]
      await expect(action(context, params)).rejects.toThrow(
        'Error fetching the image: Server error'
      )
    })

    it('FETCH_IMAGE on 404 doesnt break and commits MEDIA_NOT_FOUND', async () => {
      const mediaType = IMAGE
      services[IMAGE] = {
        getMediaDetail: jest.fn(() =>
          Promise.reject({ response: { status: 404 } })
        ),
      }
      const params = { id: 'foo' }
      const action = createActions(services)[FETCH_IMAGE]
      await action(context, params)
      expect(context.commit).toHaveBeenCalledWith(MEDIA_NOT_FOUND, {
        mediaType,
      })
    })

    it('HANDLE_MEDIA_ERROR handles 500 error', () => {
      const action = createActions(services)[HANDLE_MEDIA_ERROR]
      const error = { response: { status: 500, message: 'Server error' } }

      action(context, { mediaType: AUDIO, error })
      expect(context.commit).toHaveBeenCalledWith(FETCH_MEDIA_ERROR, {
        errorMessage: 'There was a problem with our servers',
        mediaType: AUDIO,
      })
    })

    it('HANDLE_MEDIA_ERROR handles a 403 error', () => {
      const action = createActions(services)[HANDLE_MEDIA_ERROR]
      const error = { response: { status: 403, message: 'Server error' } }

      action(context, { mediaType: AUDIO, error })
      expect(context.commit).toHaveBeenCalledWith(FETCH_MEDIA_ERROR, {
        errorMessage: error.response.message,
        mediaType: AUDIO,
      })
    })

    it('HANDLE_MEDIA_ERROR throws a new error on error when server did not respond', async () => {
      const action = createActions(services)[HANDLE_MEDIA_ERROR]
      const error = new Error('Server did not respond')
      await expect(
        action(context, { mediaType: AUDIO, error })
      ).rejects.toThrow(error.message)
    })

    it('HANDLE_NO_MEDIA throws an error when media count is 0', async () => {
      const action = createActions(services)[HANDLE_NO_MEDIA]
      await action(context, { mediaCount: 0, mediaType: IMAGE })
      expect(context.commit).toHaveBeenLastCalledWith(FETCH_MEDIA_ERROR, {
        errorMessage: 'No image found for this query',
      })
    })

    it('HANDLE_NO_MEDIA does not throw an error when media count is not 0', () => {
      const action = createActions(services)[HANDLE_NO_MEDIA]
      action(context, { mediaCount: 1, mediaType: IMAGE })
      expect(context.commit.mock.calls.length).toEqual(0)
    })
  })
})
