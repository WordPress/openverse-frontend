import { useWindowSize, watchThrottled } from '@vueuse/core'

import { useUiStore } from '~/stores/ui'

import { SCREEN_SIZES } from '~/constants/screens'
import type { Breakpoint } from '~/types/screens'

const sizesReversed = [...Object.values(SCREEN_SIZES), 0]
const bpsReversed = [...Object.keys(SCREEN_SIZES), 'xs']

const widthToBreakpoint = (width: number): Breakpoint => {
  return bpsReversed[
    sizesReversed.findIndex((size) => width >= size)
  ] as Breakpoint
}

/**
 * This composable updates the UI store when the screen width changes or
 * when the SSR layout settings are different from the cookie settings.
 */
export function useLayout() {
  const uiStore = useUiStore()

  const { width } = useWindowSize()

  const updateBreakpoint = () => {
    uiStore.updateBreakpoint(widthToBreakpoint(width.value))
  }

  watchThrottled(
    width,
    (newWidth) => {
      const newBp = widthToBreakpoint(newWidth)
      uiStore.updateBreakpoint(newBp)
    },
    { throttle: 100 }
  )

  return {
    updateBreakpoint,
  }
}
