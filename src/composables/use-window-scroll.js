// code taken from Vueuse
import throttle from 'lodash.throttle'
import { defaultWindow } from '~/composables/window'
import { ref } from '@nuxtjs/composition-api'
import { useEventListener } from '~/composables/use-event-listener'

const HEADER_HEIGHT = 80

/**
 * Whether the page has been scrolled down past the header.
 *
 * @type {import('@nuxtjs/composition-api').Ref<boolean>}
 */
export const isHeaderScrolled = ref(false)

/**
 *
 * @param {object} options
 * @param {Window} [options.window]
 * @param {number} [options.throttleMs] - time to throttle the scroll handler.
 * Set to 0 to remove throttling
 */
export function useWindowScroll({
  window = defaultWindow,
  throttleMs = 200,
} = {}) {
  if (!window) {
    return {
      x: ref(0),
      y: ref(0),
    }
  }

  const x = ref(window.pageXOffset)
  const y = ref(window.pageYOffset)

  const scrollHandler = () => {
    x.value = window.pageXOffset
    y.value = window.pageYOffset
    isHeaderScrolled.value = y.value > HEADER_HEIGHT
  }

  const handler = throttleMs
    ? throttle(scrollHandler, throttleMs)
    : scrollHandler

  useEventListener(window, 'scroll', handler, {
    capture: false,
    passive: true,
  })

  return { x, y, isHeaderScrolled }
}
