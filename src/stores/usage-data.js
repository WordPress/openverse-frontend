import { defineStore } from 'pinia'

import {
  SEND_SEARCH_QUERY_EVENT,
  SEND_RESULT_CLICKED_EVENT,
  SEND_DETAIL_PAGE_EVENT,
  SEND_SEARCH_RATING_EVENT,
} from '~/constants/usage-data-analytics-types'

import UsageDataService from '~/data/usage-data-service'

import { stringToBoolean } from '~/utils/string-to-boolean.ts'
import { sentryConfig } from '~/utils/sentry-config.ts'

const disabled = !stringToBoolean(process.env.enableInternalAnalytics)

/**
 * Catch api event failures, mainly to prevent SSR errors on test domains that cannot communicate with our API server.
 * Alternatively, just disable internal analytics on those servers with ENABLE_INTERNAL_ANALYTICS=false in the environment.
 * @param {string} eventName
 * @param {import('vue').default} context
 */
const handleUsageEvent = (eventName, context) => (promise) =>
  promise.catch(
    (error) =>
      // $sentryReady won't exist if sentry has been disabled
      !sentryConfig.disabled &&
      context.$sentryReady().then((sentry) =>
        sentry.captureException(error, (scope) => {
          scope.setTag('event_name', eventName)
          scope.setTag('request_url', error.config.url)
        })
      )
  )
// Analytics requests shouldn't block because they don't have any bearing on the UI and blocking on them will make UI less responsive
export const createUseUsageDataStore = (usageDataService = UsageDataService) =>
  defineStore('usage-data', {
    actions: {
      sendSearchQueryEvent(params) {
        if (disabled) return
        handleUsageEvent(
          SEND_SEARCH_QUERY_EVENT,
          this.$nuxt
        )(usageDataService.sendSearchQueryEvent(params))
      },
      sendResultClickedEvent(params) {
        if (disabled) return
        handleUsageEvent(
          SEND_RESULT_CLICKED_EVENT,
          this.$nuxt
        )(usageDataService.sendResultClickedEvent(params))
      },
      sendSearchRatingEvent(params) {
        if (disabled) return
        handleUsageEvent(
          SEND_SEARCH_RATING_EVENT,
          this.$nuxt
        )(usageDataService.sendSearchRatingEvent(params))
      },
      sendDetailPageEvent(params) {
        if (disabled) return
        handleUsageEvent(
          SEND_DETAIL_PAGE_EVENT,
          this.$nuxt
        )(usageDataService.sendDetailPageEvent(params))
      },
    },
  })
export const useUsageDataStore = createUseUsageDataStore()
