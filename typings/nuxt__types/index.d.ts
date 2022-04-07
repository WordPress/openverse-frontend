import '@nuxt/types'
import type { Details as UADetails } from 'express-useragent'
import type { NuxtApp } from '@nuxt/types/app'

declare module '@nuxt/types' {
  export interface Context {
    $ua: UADetails | null
  }
  export interface NuxtAppOptions {
    $ua: UADetails | null
  }
}
declare global {
  interface Window {
    $nuxt: NuxtApp
  }
}
