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
    audio: /** @type {import('~/data/services').MediaService} */ ({
      getMediaDetail: jest.fn(),
    }),
    image: /** @type {import('~/data/services').MediaService} */ ({
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

        await mediaItemStore.fetchMediaItem('foo', type)
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
        await mediaItemStore.fetchMediaItem(`${type}1`, type)
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

        await expect(() =>
          mediaItemStore.fetchMediaItem('foo', type)
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
        const id = 'foo'
        await expect(() =>
          mediaItemStore.fetchMediaItem(id, type)
        ).rejects.toThrow(`Media of type ${type} with id ${id} not found`)
      }
    )
  })
})
