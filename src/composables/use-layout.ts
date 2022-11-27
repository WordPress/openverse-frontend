import { useWindowSize, watchThrottled } from '@vueuse/core'

import type { Breakpoint } from '~/constants/screens'
import { breakpoints, screenSizes, useUiStore } from '~/stores/ui'

const widthToBreakpoint = (width: number): Breakpoint => {
  return breakpoints[
    screenSizes.findIndex((size) => width >= size)
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
