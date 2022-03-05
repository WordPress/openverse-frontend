import { createPinia, setActivePinia } from 'pinia'

import { createUseUsageDataStore } from '~/stores/usage-data'

jest.mock('~/utils/sentry-config.ts', () => ({
  sentryConfig: { disabled: false },
}))
describe('Usage Data Store Store', () => {
  describe('actions', () => {
    let usageDataServiceMock = null
    const data = { foo: 'bar' }
    let usageDataStore

    beforeEach(() => {
      usageDataServiceMock = {
        sendSearchQueryEvent: jest.fn(() => Promise.resolve()),
        sendResultClickedEvent: jest.fn(() => Promise.resolve()),
        sendDetailPageEvent: jest.fn(() => Promise.resolve()),
        sendSearchRatingEvent: jest.fn(() => Promise.resolve()),
      }
      setActivePinia(createPinia())
      usageDataStore = createUseUsageDataStore(usageDataServiceMock)()
    })

    it('sendSearchQueryEvent sends search query event', async () => {
      await usageDataStore.sendSearchQueryEvent(data)

      expect(usageDataServiceMock.sendSearchQueryEvent).toHaveBeenCalledWith(
        data
      )
    })

    it('sendResultClickedEvent sends result clicked event', async () => {
      await usageDataStore.sendResultClickedEvent(data)

      expect(usageDataServiceMock.sendResultClickedEvent).toHaveBeenCalledWith(
        data
      )
    })

    it('sendDetailPageEvent sends detail page event', async () => {
      await usageDataStore.sendDetailPageEvent(data)

      expect(usageDataServiceMock.sendDetailPageEvent).toHaveBeenCalledWith(
        data
      )
    })

    it('sendSearchRatingEvent sends result clicked event', async () => {
      await usageDataStore.sendSearchRatingEvent(data)

      expect(usageDataServiceMock.sendSearchRatingEvent).toHaveBeenCalledWith(
        data
      )
    })
  })

  describe('Sentry captures the exceptions that are thrown before it was loaded', () => {
    process.env.enableInternalAnalytics = 'true'

    let usageDataServiceMock = null
    const data = { foo: 'bar' }
    const errorMessage = 'test error'
    let usageDataStore
    let pinia = createPinia()

    const expectedError = new Error(errorMessage)

    const sendResult = jest.fn(() => Promise.reject(expectedError))

    beforeEach(() => {
      usageDataServiceMock = {
        sendResultClickedEvent: sendResult,
      }
      setActivePinia(pinia)
      usageDataStore = createUseUsageDataStore(usageDataServiceMock)()
    })
    it('sendResultClickedEvent sends result clicked event', async () => {
      // Mocking the $sentryReady promise that is used to capture errors that are thrown
      // before sentry is loaded (on lazy-load)
      const captureExceptionMock = jest.fn()
      usageDataStore.$nuxt = {
        $sentryReady: () =>
          Promise.resolve({ captureException: captureExceptionMock }),
      }
      usageDataStore.sendResultClickedEvent(data)

      expect(usageDataServiceMock.sendResultClickedEvent).toHaveBeenCalledWith(
        data
      )
      // Need to wait for the async function to be called
      await new Promise((r) => setTimeout(r, 1000))
      expect(captureExceptionMock).toHaveBeenCalledTimes(1)
      expect(captureExceptionMock.mock.calls[0][0]).toEqual(expectedError)
      expect(typeof captureExceptionMock.mock.calls[0][1]).toEqual('function')
    })
  })
})
