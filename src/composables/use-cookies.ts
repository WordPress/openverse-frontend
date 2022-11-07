/**
 * This composable enables setting and getting app cookies.
 * Normally, we cannot call the `app.$cookies.set` function from outside a
 * `setup` function. Here, we overcome this constraint by passing the `app`
 * parameter into the composable and thus saving the necessary context.
 */
import { isProd } from '~/utils/node-env'

import type { NuxtAppOptions } from '@nuxt/types'
import type { CookieSerializeOptions } from 'cookie'

export type CookieValue =
  | string
  | boolean
  | Record<string, boolean | string | undefined>

const cookieOptions: CookieSerializeOptions = {
  path: '/',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 60,
  secure: isProd,
}

export const useCookies = <T extends CookieValue>(
  app: NuxtAppOptions,
  name: string
) => {
  /**
   * Sets the cookie with the `value`, using the useCookie's `name`.
   *
   * @param value - if not a string, this value is converted to string using
   * `JSON.stringify`.
   */
  const setCookie = (value: T) => {
    const cookieValue =
      typeof value === 'string' ? value : JSON.stringify(value)

    app.$cookies.set(name, cookieValue, cookieOptions)
  }

  const updateCookie = (value: Omit<T, string>) => {
    const currentValue = app.$cookies.get(name) ?? {}

    app.$cookies.set(
      name,
      JSON.stringify({ ...currentValue, ...value }),
      cookieOptions
    )
  }

  const getCookie = (cookieName: string): string | boolean | undefined => {
    const cookieValueObject = app.$cookies.get(name)
    if (cookieValueObject && cookieName in cookieValueObject) {
      return cookieValueObject[cookieName]
    }
    return undefined
  }

  return {
    setCookie,
    getCookie,
    updateCookie,
  }
}
export default useCookies
