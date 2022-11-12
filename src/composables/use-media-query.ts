/* this implementation is from https://github.com/vueuse/vueuse/packages/core/useMediaQuery/
 which, in turn, is ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */
import { computed, ref, watchEffect } from '@nuxtjs/composition-api'

import { resolveRef } from '@vueuse/core'

import { SCREEN_SIZES, Breakpoint } from '~/constants/screens'
import { defaultWindow } from '~/constants/window'
import { tryOnScopeDispose } from '~/utils/try-on-scope-dispose'
import { useSupported } from '~/composables/use-supported'

import type { MaybeComputedRef } from '@vueuse/core'

interface Options {
  shouldPassInSSR?: boolean
  window?: Window
}

/**
 * Reactive Media Query.
 */
export function useMediaQuery(
  query: MaybeComputedRef<string>,
  options: Options = { shouldPassInSSR: false }
) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(
    () =>
      window &&
      'matchMedia' in window &&
      typeof window.matchMedia === 'function'
  )

  let mediaQuery: MediaQueryList | undefined
  const matches = ref(Boolean(options.shouldPassInSSR))

  const cleanup = () => {
    if (!mediaQuery) return
    if ('removeEventListener' in mediaQuery) {
      mediaQuery.removeEventListener('change', update)
    } else {
      // @ts-expect-error deprecated API
      mediaQuery.removeListener(update)
    }
  }

  const update = () => {
    if (!isSupported.value) {
      return
    }
    // This is already checked in `isSupported`, but TS doesn't know that
    if (!window) return

    cleanup()

    mediaQuery = window.matchMedia(resolveRef(query).value)
    matches.value = mediaQuery.matches

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', update)
    } else {
      // @ts-expect-error deprecated API
      mediaQuery.addListener(update)
    }
  }

  watchEffect(update)

  tryOnScopeDispose(() => cleanup())

  return matches
}
type BreakpointWithoutXs = Exclude<Breakpoint, 'xs'>
/**
 * Check whether the current screen meets
 * or exceeds the provided breakpoint size.
 */
export const isMinScreen = (
  breakpointName: MaybeComputedRef<Breakpoint>,
  options?: Options
) => {
  if (breakpointName === 'xs') {
    // `xs` is the "minimum" so it is always true
    return ref(true)
  }

  const query = computed(() => {
    const sizeInPx = SCREEN_SIZES.get(
      resolveRef(breakpointName as BreakpointWithoutXs).value
    )
    return `(min-width: ${sizeInPx}px)`
  })

  return useMediaQuery(query, options)
}

/**
 * Check if the user prefers reduced motion or not.
 */
export function useReducedMotion(options?: Options) {
  return useMediaQuery('(prefers-reduced-motion: reduce)', options)
}
