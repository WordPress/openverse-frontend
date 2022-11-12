import { computed, watch } from '@nuxtjs/composition-api'

import { useFeatureFlagStore } from '~/stores/feature-flag'
import { isMinScreen } from '~/composables/use-media-query'

import useUiState from '~/composables/use-ui-state'

import type { NuxtAppOptions } from '@nuxt/types'

/**
 * This composable updates the UI store when the screen width changes or
 * when the SSR layout settings are different from the cookie settings.
 *
 * The threshold for switching between mobile and desktop layout is
 * `lg` for the `new_header` and `md` for the `old_header`.
 */
export default function useLayout({ app }: { app: NuxtAppOptions }) {
  const uiState = useUiState(app)
  const featureFlagStore = useFeatureFlagStore()

  const isNewHeaderEnabled = computed(() => featureFlagStore.isOn('new_header'))

  // `isMobile` is set in the middleware for each server request.
  const shouldPassInSSR = uiState.isDesktopLayout.value
  const desktopBreakpoint = computed(() =>
    isNewHeaderEnabled.value ? 'lg' : 'md'
  )

  const isDesktopLayout = isMinScreen(desktopBreakpoint, { shouldPassInSSR })

  watch(isDesktopLayout, (isDesktop) => {
    updateLayout(isDesktop)
  })

  const updateLayout = (isDesktop: boolean) => {
    uiState.updateBreakpoint(isDesktop)
  }

  return {
    isDesktopLayout,
    updateLayout,
  }
}
