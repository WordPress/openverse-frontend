import { defineStore } from 'pinia'

import { cookieOptions } from '~/types/cookies'

import type { OpenverseCookieState, SnackbarState } from '~/types/cookies'

import { needsTranslationBanner } from '~/utils/translation-banner'
import { useNavigationStore } from '~/stores/navigation'

import type { BannerId, TranslationBannerId } from '~/types/banners'

import type { LocaleObject } from '@nuxtjs/i18n'

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
  /**
   * array of banner ids that were dismissed
   */
  dismissedBanners: BannerId[]
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    instructionsSnackbarState: 'not_shown',
    innerFilterVisible: false,
    isFilterDismissed: false,
    isDesktopLayout: false,
    isMobileUa: true,
    dismissedBanners: [],
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
    /**
     * The locale object of the current locale.
     */
    currentLocale(): LocaleObject {
      return this.$nuxt.i18n.localeProperties
    },
    /**
     * The id used in the translation banner and the cookies for dismissed banners.
     * @example 'translation-ru'
     */
    translationBannerId(): TranslationBannerId {
      return `translation-${this.currentLocale.code as LocaleObject['code']}`
    },
    /**
     * The translation banner is shown if the translated percentage is below 90%,
     * and the banner for the current locale was not dismissed (status from cookies).
     */
    shouldShowTranslationBanner(): boolean {
      return (
        !this.dismissedBanners.includes(this.translationBannerId) &&
        needsTranslationBanner(this.currentLocale)
      )
    },
    /**
     * The migration banner is shown if the user is referred from CC Search,
     * and hasn't dismissed it yet.
     */
    shouldShowMigrationBanner(): boolean {
      const navigationStore = useNavigationStore()
      return (
        !this.dismissedBanners.includes('cc-referral') &&
        navigationStore.isReferredFromCc
      )
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
    initFromCookies(cookies: OpenverseCookieState) {
      this.isDesktopLayout = cookies.uiIsDesktopLayout ?? false
      this.isFilterDismissed = cookies.uiIsFilterDismissed ?? false
      this.isMobileUa = cookies.uiIsMobileUa ?? false
      this.innerFilterVisible = this.isDesktopLayout
        ? !this.isFilterDismissed
        : false
      this.dismissedBanners = cookies.uiDismissedBanners ?? []
    },

    /**
     * If the breakpoint is different from the state, updates the state, and saves it into app cookies.
     *
     * @param isDesktopLayout - whether the layout is desktop (`lg` with the `new_header`
     * and `md` with the `old_header`).
     */
    updateBreakpoint(isDesktopLayout: boolean) {
      if (this.isDesktopLayout !== isDesktopLayout) {
        this.isDesktopLayout = isDesktopLayout
        this.$nuxt.$cookies.set(
          'uiIsDesktopLayout',
          this.isDesktopLayout,
          cookieOptions
        )
      }
    },

    /**
     * Sets the filter state based on the `visible` parameter.
     * If the filter state is changed on desktop, updates the `isFilterDismissed`
     * 'ui' cookie value.
     *
     * @param visible - whether the filters should be visible.
     */
    setFiltersState(visible: boolean) {
      this.innerFilterVisible = visible
      if (this.isDesktopLayout) {
        this.isFilterDismissed = !visible
        this.$nuxt.$cookies.set(
          'uiIsFilterDismissed',
          this.isFilterDismissed,
          cookieOptions
        )
      }
    },

    /**
     * Toggles filter state and saves the new state in a cookie.
     */
    toggleFilters() {
      this.setFiltersState(!this.isFilterVisible)
    },
    /**
     * If the banner wasn't dismissed before, dismisses it and saves the new state in a cookie.
     * @param bannerId - the id of the banner to dismiss.
     */
    dismissBanner(bannerId: BannerId) {
      if (!this.dismissedBanners.includes(bannerId)) {
        this.dismissedBanners.push(bannerId)
        this.$nuxt.$cookies.set(
          'uiDismissedBanners',
          this.dismissedBanners,
          cookieOptions
        )
      }
    },
    isBannerDismissed(bannerId: BannerId) {
      return this.dismissedBanners.includes(bannerId)
    },
  },
})
