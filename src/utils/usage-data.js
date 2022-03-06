import {
  SEND_DETAIL_PAGE_EVENT,
  SEND_SEARCH_QUERY_EVENT,
} from '~/constants/usage-data-analytics-types'
import UsageDataService from '~/data/usage-data-service'
import { sentryConfig } from '~/utils/sentry-config'
import { stringToBoolean } from '~/utils/string-to-boolean'

const disabled = !stringToBoolean(process.env.enableInternalAnalytics)

/**
 * Catch api event failures, mainly to prevent SSR errors on test domains that
 * cannot communicate with our API server.
 * @param {string} eventName
 * @param {import('vue').default} context
 */
const handleUsageEvent = (eventName, context) => (promise) =>
  promise.catch((error) => {
    // $sentryReady won't exist if sentry has been disabled
    !sentryConfig.disabled &&
      context.$sentryReady().then((sentry) =>
        sentry.captureException(error, (scope) => {
          scope.setTag('event_name', eventName)
          scope.setTag('request_url', error.config.url)
        })
      )
  })

const usageData = {
  sendSearchQueryEvent(params, context) {
    if (disabled) return
    handleUsageEvent(
      SEND_SEARCH_QUERY_EVENT,
      context
    )(UsageDataService.sendSearchQueryEvent(params))
  },

  sendResultClickedEvent(params, context) {
    if (disabled) return
    handleUsageEvent(
      SEND_SEARCH_QUERY_EVENT,
      context
    )(UsageDataService.sendResultClickedEvent(params))
  },

  sendDetailPageEvent(params, context) {
    if (disabled) return
    handleUsageEvent(
      SEND_DETAIL_PAGE_EVENT,
      context
    )(UsageDataService.sendDetailPageEvent(params))
  },
}

export default usageData
