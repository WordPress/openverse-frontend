import useragent, { Details } from 'express-useragent'

import type { Plugin } from '@nuxt/types'

declare module '@nuxt/types' {
  interface Context {
    $ua: Details | null
  }
}

const uaParsePlugin: Plugin = (context, inject) => {
  let userAgent

  if (typeof context.req !== 'undefined') {
    userAgent = context.req.headers['user-agent']
  } else if (typeof navigator !== 'undefined') {
    userAgent = navigator.userAgent
  }
  let ua
  if (typeof userAgent == 'string') {
    ua = useragent.parse(userAgent)
  } else {
    ua = null
  }

  context.$ua = ua
  inject('ua', ua)
}

export default uaParsePlugin
