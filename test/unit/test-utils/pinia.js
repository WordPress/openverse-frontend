// eslint-disable-next-line no-restricted-imports
import * as pinia from 'pinia'

export const createPinia = () =>
  pinia.createPinia().use(() => ({
    $nuxt: {
      $openverseApiToken: '',
      $sentry: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        captureException: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        captureEvent: () => {},
      },
    },
  }))

export const setActivePinia = pinia.setActivePinia

export const PiniaVuePlugin = pinia.PiniaVuePlugin
