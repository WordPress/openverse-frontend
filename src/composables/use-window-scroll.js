// code taken from Vueuse
import throttle from 'lodash.throttle'
import { defaultWindow } from '~/composables/window'
import { ref, useState } from '#app'
import { useEventListener } from '~/composables/use-event-listener'

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
  const isWindowScrolled = useState('window-scrolled', () => false)

  if (!window) {
    return {
      x: ref(0),
      y: ref(0),
      isWindowScrolled,
    }
  }

  const x = ref(window.pageXOffset)
  const y = ref(window.pageYOffset)

  const scrollHandler = () => {
    x.value = window.pageXOffset
    y.value = window.pageYOffset
    isWindowScrolled.value = y.value > 0
  }

  const handler = throttleMs
    ? throttle(scrollHandler, throttleMs)
    : scrollHandler

  useEventListener(window, 'scroll', handler, {
    capture: false,
    passive: true,
  })

  return { x, y, isWindowScrolled }
}
