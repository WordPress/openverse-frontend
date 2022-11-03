/**
 * This composable enables setting and getting app cookies.
 * Normally, we cannot call the `app.$cookies.set` function from outside a
 * `setup` function. Here, we overcome this constraint by passing the `app`
 * parameter into the composable and thus saving the necessary context.
 */
import type { NuxtAppOptions } from '@nuxt/types'

type CookieValue = string | Record<string, boolean | string | undefined>

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

    app.$cookies.set(name, cookieValue, { sameSite: true })
  }

  const getCookie = (): string | undefined => {
    return app.$cookies.get(name)
  }

  return {
    setCookie,
    getCookie,
  }
}
export default useCookies
