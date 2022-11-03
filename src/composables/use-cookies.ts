/**
 * This composable enables setting and getting app cookies.
 * Normally, we cannot call the `app.$cookies.set` function from outside a
 * `setup` function. Here, we overcome this constraint by passing the `app`
 * parameter into the composable and thus saving the necessary context.
 */
import { isProd } from '~/utils/node-env'

import type { OpenverseCookies } from '~/types/cookies'

import type { NuxtAppOptions } from '@nuxt/types'
import type { CookieSerializeOptions } from 'cookie'

const cookieOptions: CookieSerializeOptions = {
  path: '/',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 60,
  secure: isProd,
}

export const useCookies = (app: NuxtAppOptions) => {
  const get = <Key extends keyof OpenverseCookies>(
    key: Key
  ): OpenverseCookies[Key] => {
    return app.$cookies.get(key)
  }

  const set = <Key extends keyof OpenverseCookies>(
    key: Key,
    value: OpenverseCookies[Key]
  ) => {
    app.$cookies.set(key, value, cookieOptions)
  }

  return { get, set }
}

export type UseCookies = ReturnType<typeof useCookies>
