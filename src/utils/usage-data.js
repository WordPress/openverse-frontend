import { useContext } from '@nuxtjs/composition-api'

import { SEND_DETAIL_PAGE_EVENT } from '~/constants/usage-data-analytics-types'
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
const handleUsageEvent = (eventName) => (promise) =>
  promise.catch((error) => {
    const { app } = useContext()

    // $sentryReady won't exist if sentry has been disabled
    !sentryConfig.disabled &&
      app.$sentryReady().then((sentry) =>
        sentry.captureException(error, (scope) => {
          scope.setTag('event_name', eventName)
          scope.setTag('request_url', error.config.url)
        })
      )
  })

export function sendDetailPageEvent(params) {
  if (disabled) return
  handleUsageEvent(SEND_DETAIL_PAGE_EVENT)(
    UsageDataService.sendDetailPageEvent(params)
  )
}
