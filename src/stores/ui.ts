import { defineStore } from 'pinia'

/**
 * By default, the filters are shown on desktop, and hidden on the mobile widths.
 * `dismissed` is used when the filters are closed on the desktop width.
 */
export const VISIBLE = 'visible'
export const DISMISSED = 'dismissed'
export const NOT_SHOWN = 'not_shown'
const snackbarStates = [NOT_SHOWN, VISIBLE, DISMISSED] as const
export type SnackbarState = typeof snackbarStates[number]

export interface UiStateCookie {
  isDesktopLayout?: boolean
  isMobileUa?: boolean
  isFilterDismissed?: boolean
}

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

type UiCookieSetter = (value: UiStateCookie) => void

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    instructionsSnackbarState: NOT_SHOWN,
    innerFilterVisible: false,
    isFilterDismissed: false,
    isDesktopLayout: false,
    isMobileUa: true,
  }),

  getters: {
    areInstructionsVisible(state): boolean {
      return state.instructionsSnackbarState === VISIBLE
    },
    uiCookie(state): UiStateCookie {
      return {
        isDesktopLayout: state.isDesktopLayout,
        isMobileUa: state.isMobileUa,
        isFilterDismissed: state.isFilterDismissed,
      }
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
      if (this.instructionsSnackbarState === NOT_SHOWN) {
        this.instructionsSnackbarState = VISIBLE
      }
    },
    hideInstructionsSnackbar() {
      this.instructionsSnackbarState = DISMISSED
    },
    /**
     * Given a list of key value pairs of UI state parameters and their states,
     * populate the store state to match the cookie.
     *
     * Cookie is updated if one of the cookie values (see UiStateCookie) changes.
     *
     * @param cookies - mapping of UI state parameters and their states.
     * @param isMobile - whether the request has a mobile user agent, set in middleware.
     */
    initFromCookies(cookies: UiStateCookie, isMobile: boolean | null) {
      this.isDesktopLayout = cookies.isDesktopLayout ?? false
      this.isFilterDismissed = cookies.isFilterDismissed ?? false

      // True if the request has a mobile user agent, or
      // if the cookie `isMobileUa` value is true.
      this.isMobileUa = Boolean((isMobile ?? false) || cookies.isMobileUa)
      this.innerFilterVisible = this.isDesktopLayout
        ? !this.isFilterDismissed
        : false
    },
    /**
     * If the breakpoint or UA are different from the state,
     * updates the state, and saves it into app cookies.
     *
     * @param isDesktopLayout - whether the layout is desktop (`lg` with the `new_header`
     * and `md` with the `old_header`).
     * @param isMobileUa - whether the request's user agent is `mobile` or not.
     * @param setCookieFn - sets the app cookie.
     */
    updateBreakpoint(
      isDesktopLayout: boolean,
      isMobileUa: boolean,
      setCookieFn: UiCookieSetter
    ) {
      if (
        this.isDesktopLayout !== isDesktopLayout ||
        this.isMobileUa !== isMobileUa
      ) {
        this.isDesktopLayout = isDesktopLayout
        this.isMobileUa = isMobileUa

        setCookieFn(this.uiCookie)
      }
    },
    /**
     * Sets the filter state based on the `visible` parameter.
     * If the filter state is changed on desktop, updates the `isFilterDismissed`
     * 'ui' cookie value.
     *
     * @param visible - whether the filters should be visible.
     * @param setCookieFn - the function that sets the app cookies
     */
    setFiltersState(visible: boolean, setCookieFn: UiCookieSetter) {
      this.innerFilterVisible = visible
      if (this.isDesktopLayout) {
        this.isFilterDismissed = !visible
        setCookieFn(this.uiCookie)
      }
    },
    /**
     * Toggles filter state and saves the new state in a cookie.
     */
    toggleFilters(setCookieFn: UiCookieSetter) {
      this.setFiltersState(!this.isFilterVisible, setCookieFn)
    },
  },
})
