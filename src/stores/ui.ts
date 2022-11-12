import { defineStore } from 'pinia'

import type { UseCookies } from '~/composables/use-cookies'
import type { OpenverseCookies, SnackbarState } from '~/types/cookies'

export type CookieSetter = UseCookies['set']

export interface UiState {
  /**
   * whether to show the instructions snackbar.
   */
  instructionsSnackbarState: SnackbarState
  /**
   * whether the filters are shown (sidebar on desktop or modal on mobile).
   * This is the inner value, components should use the un-prefixed getter.
   */
  innerFilterVisible: boolean
  /**
   * (only for desktop layout) whether the filters were dismissed. If true,
   * the filters should be closed on SSR for the first load on desktop layout.
   */
  isFilterDismissed: boolean
  /**
   * whether the site layout is desktop (or mobile).
   */
  isDesktopLayout: boolean
  /**
   * whether the request user agent is mobile or not.
   */
  isMobileUa: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    instructionsSnackbarState: 'not_shown',
    innerFilterVisible: false,
    isFilterDismissed: false,
    isDesktopLayout: false,
    isMobileUa: true,
  }),

  getters: {
    areInstructionsVisible(state): boolean {
      return state.instructionsSnackbarState === 'visible'
    },
    /**
     * On desktop, we only hide the filters sidebar if it was
     * specifically dismissed on the desktop layout.
     *
     * The filters state could diverge if the layout changed from desktop to mobile:
     * closing the filters on mobile sets `isFilterVisible` to false, but does not
     * save the `isFilterDismissed` because it only applies on the desktop layout.
     *
     * This getter correct the state if it diverged, and then returns the visibility state.
     */
    isFilterVisible(state: UiState): boolean {
      if (
        state.isDesktopLayout &&
        !state.isFilterDismissed &&
        !state.innerFilterVisible
      ) {
        state.innerFilterVisible = true
      }
      return state.innerFilterVisible
    },
  },

  actions: {
    showInstructionsSnackbar() {
      if (this.instructionsSnackbarState === 'not_shown') {
        this.instructionsSnackbarState = 'visible'
      }
    },

    hideInstructionsSnackbar() {
      this.instructionsSnackbarState = 'dismissed'
    },
    /**
     * Given a list of key value pairs of UI state parameters and their states,
     * populate the store state to match the cookie.
     *
     * @param cookies - mapping of UI state parameters and their states.
     */
    initFromCookies(cookies: OpenverseCookies) {
      this.isDesktopLayout = cookies.uiIsDesktopLayout ?? false
      this.isFilterDismissed = cookies.uiIsFilterDismissed ?? false

      // Middleware sets the cookie value before calling `initFromCookies`.
      this.isMobileUa = cookies.uiIsMobileUa ?? false
      this.innerFilterVisible = this.isDesktopLayout
        ? !this.isFilterDismissed
        : false
    },

    /**
     * If the breakpoint is different from the state, updates the state.
     * Should not be called directly, use `useUiState.updateBreakpoint` instead.
     *
     * @param isDesktopLayout - whether the layout is desktop (`lg` with the `new_header`
     * and `md` with the `old_header`).
     * @param setCookieFn - sets the app cookie.
     */
    _updateBreakpoint(isDesktopLayout: boolean, setCookieFn: CookieSetter) {
      if (this.isDesktopLayout !== isDesktopLayout) {
        this.isDesktopLayout = isDesktopLayout
        setCookieFn('uiIsDesktopLayout', this.isDesktopLayout)
      }
    },

    /**
     * Sets the filter state based on the `visible` parameter.
     * If the filter state is changed on desktop, updates the `isFilterDismissed`
     * 'ui' cookie value.
     * Should not be called directly, use `useUiState.setFiltersState` instead.
     *
     * @param visible - whether the filters should be visible.
     * @param setCookieFn - the function that sets the app cookies
     */
    _setFiltersState(visible: boolean, setCookieFn: CookieSetter) {
      this.innerFilterVisible = visible
      if (this.isDesktopLayout && this.isFilterDismissed === visible) {
        this.isFilterDismissed = !visible
        setCookieFn('uiIsFilterDismissed', this.isFilterDismissed)
      }
    },
  },
})
