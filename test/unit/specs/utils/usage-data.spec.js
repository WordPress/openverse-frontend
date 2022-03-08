import usageData from '~/utils/usage-data'
import UsageDataService from '~/data/usage-data-service'

jest.mock('~/data/usage-data-service', () => ({
  sendSearchQueryEvent: jest.fn(() => Promise.resolve()),
  sendResultClickedEvent: jest.fn(() => Promise.resolve()),
  sendDetailPageEvent: jest.fn(() => Promise.resolve()),
}))

// Omit Sentry on tests
jest.mock('~/utils/sentry-config.ts', () => ({
  sentryConfig: { disabled: true },
}))

describe('usage-data utils', () => {
  let context
  const sentryReadyMock = jest.fn(() => Promise.resolve())

  beforeEach(() => {
    context = {
      $sentryReady: sentryReadyMock,
    }
  })

  it('sendSearchQueryEvent calls homonym function on data service correctly', () => {
    const eventData = { query: 'foo', sessionId: '123' }
    usageData.sendSearchQueryEvent(eventData, context)
    expect(UsageDataService.sendSearchQueryEvent).toHaveBeenCalledWith(
      eventData
    )
  })

  it('sendResultClickedEvent calls homonym function on data service correctly', () => {
    const eventData = {
      query: 'foo',
      resultRank: '456',
      resultUuid: '1234-abcd-5678',
      sessionId: '123',
    }
    usageData.sendResultClickedEvent(eventData, context)
    expect(UsageDataService.sendResultClickedEvent).toHaveBeenCalledWith(
      eventData
    )
  })

  it('sendDetailPageEvent calls homonym function on data service correctly', () => {
    const eventData = { eventType: 'foo', resultUuid: '1234-abcd-5678' }
    usageData.sendSearchQueryEvent(eventData, context)
    expect(UsageDataService.sendSearchQueryEvent).toHaveBeenCalledWith(
      eventData
    )
  })
})
