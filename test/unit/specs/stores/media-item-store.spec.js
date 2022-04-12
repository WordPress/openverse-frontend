import { createPinia, setActivePinia } from 'pinia'

import { initialFetchState } from '~/composables/use-fetch-state'
import { AUDIO, IMAGE, supportedMediaTypes } from '~/constants/media'
import { useMediaStore } from '~/stores/media'
import { useMediaItemStore } from '~/stores/media/media-item'
import { services } from '~/stores/media/services'

const detailData = {
  [AUDIO]: { title: 'audioDetails', id: 'audio1' },
  [IMAGE]: { title: 'imageDetails', id: 'image1' },
}
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn((obj) => 'response' in obj),
}))
jest.mock('~/stores/media/services', () => ({
  services: {
    audio: /** @type {typeof import('~/data/services').MediaService} */ ({
      getMediaDetail: jest.fn(),
    }),
    image: /** @type {typeof import('~/data/services').MediaService} */ ({
      getMediaDetail: jest.fn(),
    }),
  },
}))
for (const mediaType of [AUDIO, IMAGE]) {
  services[mediaType].getMediaDetail.mockImplementation(() =>
    Promise.resolve(detailData[mediaType])
  )
}
describe('Media Item Store', () => {
  describe('state', () => {
    it('sets default state', () => {
      setActivePinia(createPinia())
      const mediaItemStore = useMediaItemStore()
      expect(mediaItemStore.fetchState).toEqual(initialFetchState)
      expect(mediaItemStore.mediaItem).toEqual(null)
      expect(mediaItemStore.mediaType).toEqual(IMAGE)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
      useMediaStore()
    })

    it.each(supportedMediaTypes)(
      'fetchMediaItem (%s) fetches a new media if none is found in the store',
      async (type) => {
        const mediaItemStore = useMediaItemStore()
        const params = { id: 'foo', type }
        await mediaItemStore.fetchMediaItem(params)
        expect(mediaItemStore.mediaItem).toEqual(detailData[type])
      }
    )
    it.each(supportedMediaTypes)(
      'fetchMediaItem (%s) re-uses existing media from the store',
      async (type) => {
        const mediaItemStore = useMediaItemStore()
        const mediaStore = useMediaStore()
        mediaStore.results[type].items = {
          [`${type}1`]: detailData[type],
        }
        const params = { id: `${type}1`, type }
        await mediaItemStore.fetchMediaItem(params)
        expect(mediaItemStore.mediaItem).toEqual(detailData[type])
      }
    )

    it.each(supportedMediaTypes)(
      'fetchMediaItem throws not found error on request error',
      async (type) => {
        const expectedErrorMessage = 'error'

        services[type].getMediaDetail.mockImplementationOnce(() =>
          Promise.reject(new Error(expectedErrorMessage))
        )

        const mediaItemStore = useMediaItemStore()

        const params = { id: 'foo', type }
        await expect(() =>
          mediaItemStore.fetchMediaItem(params)
        ).rejects.toThrow(expectedErrorMessage)
      }
    )

    it.each(supportedMediaTypes)(
      'fetchMediaItem on 404 sets fetchingError and throws a new error',
      async (type) => {
        services[type].getMediaDetail.mockImplementationOnce(() =>
          Promise.reject({ response: { status: 404 } })
        )
        const mediaItemStore = useMediaItemStore()
        const params = { id: 'foo', type }
        await expect(() =>
          mediaItemStore.fetchMediaItem(params)
        ).rejects.toThrow(
          `Media of type ${type} with id ${params.id} not found`
        )
      }
    )
  })
})
