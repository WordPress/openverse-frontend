import '@nuxt/types'
import type { Details as UADetails } from 'express-useragent'
import type { NuxtI18nApi } from '@nuxtjs/i18n/types/vue'

declare module '@nuxt/types' {
  export interface NuxtAppOptions {
    $ua: UADetails | null
    localePath: NuxtI18nApi.localePath
  }
}
