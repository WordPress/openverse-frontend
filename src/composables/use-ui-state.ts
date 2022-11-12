import { computed } from '@nuxtjs/composition-api'

import { useUiStore } from '~/stores/ui'

import { useCookies } from '~/composables/use-cookies'

import type { NuxtAppOptions } from '@nuxt/types'

const useUiState = (app: NuxtAppOptions) => {
  const uiStore = useUiStore()
  const cookies = useCookies(app)
  const isDesktopLayout = computed(() => uiStore.isDesktopLayout)
  /**
   * If the breakpoint is different from the state, updates the state, and saves it into app cookies.
   *
   * @param isDesktopLayout - whether the layout is desktop (`lg` with the `new_header`
   * and `md` with the `old_header`).
   */
  const updateBreakpoint = (isDesktopLayout: boolean) => {
    uiStore._updateBreakpoint(isDesktopLayout, cookies.set)
  }

  /**
   * Sets the filter state based on the `visible` parameter.
   * If the filter state is changed on desktop, updates the `uiIsFilterDismissed`
   * cookie value.
   *
   * @param visible - whether the filters should be visible.
   */
  const setFiltersState = (visible: boolean) => {
    uiStore._setFiltersState(visible, cookies.set)
  }

  /**
   * Toggles filter state and saves the new state in a cookie.
   */
  const toggleFilters = () => {
    setFiltersState(!uiStore.isFilterVisible)
  }

  return {
    updateBreakpoint,
    setFiltersState,
    toggleFilters,
    isDesktopLayout,
  }
}

export default useUiState
