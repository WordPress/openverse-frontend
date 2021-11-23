/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */
import { ref } from '@nuxtjs/composition-api'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query, options = {}) {
  const { window } = options
  if (!window) return ref(false)

  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const handler = (/** @type MediaQueryListEvent */ event) => {
    matches.value = event.matches
  }

  if ('addEventListener' in mediaQuery)
    mediaQuery.addEventListener('change', handler)
  else mediaQuery.addListener(handler)

  // onDispose(() => {
  //   if ('removeEventListener' in mediaQuery)
  //     mediaQuery.removeEventListener('change', handler)
  //   else mediaQuery.removeListener(handler)
  // })

  return matches
}
