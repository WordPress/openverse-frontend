/* this implementation is from https://github.com/vueuse/vueuse/packages/core/useMediaQuery/
 which, in turn, is ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */
import { ref } from '@nuxtjs/composition-api'

import { SCREEN_SIZES, Breakpoint } from '~/constants/screens'
import { defaultWindow } from '~/constants/window'
import { tryOnMounted } from '~/utils/try-on-mounted'
import { tryOnScopeDispose } from '~/utils/try-on-scope-dispose'

interface Options {
  shouldPassInSSR?: boolean
  window?: Window
}

/**
 * Reactive Media Query.
 */
export function useMediaQuery(
  query: string,
  options: Options = { shouldPassInSSR: false }
) {
  const { window = defaultWindow } = options

  let mediaQuery: MediaQueryList | undefined
  const matches = ref(Boolean(options.shouldPassInSSR))

  const update = () => {
    if (!window) {
      return
    }
    if (!mediaQuery) {
      mediaQuery = window.matchMedia(query)
    }
    matches.value = mediaQuery.matches
  }

  tryOnMounted(() => {
    update()

    if (!mediaQuery) return
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', update)
    } else {
      // Before Safari 14, MediaQueryList is based on EventTarget,
      // so we use addListener() and removeListener(), too.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mediaQuery.addListener(update)
    }

    tryOnScopeDispose(() => {
      if ('removeEventListener' in update) {
        mediaQuery?.removeEventListener('change', update)
      } else {
        mediaQuery?.removeListener(update)
      }
    })
  })

  return matches
}

/**
 * Check whether the current screen meets
 * or exceeds the provided breakpoint size.
 */
export const isMinScreen = (breakpointName: Breakpoint, options?: Options) => {
  if (breakpointName === 'xs') {
    // `xs` is the "minimum" so it is always true
    return ref(true)
  }

  return useMediaQuery(
    `(min-width: ${SCREEN_SIZES.get(breakpointName)}px)`,
    options
  )
}

/**
 * Check if the user prefers reduced motion or not.
 */
export function useReducedMotion(options?: Options) {
  return useMediaQuery('(prefers-reduced-motion: reduce)', options)
}
