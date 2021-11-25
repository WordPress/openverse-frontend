import { useEventListener } from '~/composables/use-event-listener'
import { computed, ref } from '@nuxtjs/composition-api'

/**
 * Use a media query.
 * @param {Ref<string> | string} query
 * @returns
 */
export function useMediaQuery(query) {
  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  useEventListener(mediaQuery, 'change', (event) => {
    matches.value = event.matches
  })

  return matches
}

/**
 * Check if the user prefers reduced motion or not.
 *
 * @returns {computed<Boolean>}
 */
export function useReducedMotion() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return computed(() => {
    if (prefersReducedMotion.value) {
      return true
    }

    return false
  })
}
