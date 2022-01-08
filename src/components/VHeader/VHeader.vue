<template>
  <header
    class="sticky top-0 py-4 px-4 md:px-7 z-40 w-full bg-white"
    :class="{
      'border-b border-white': !isHeaderScrolled && !isFilterSidebarVisible,
      'border-b border-dark-charcoal-20':
        isSearchRoute && (isHeaderScrolled || isFilterSidebarVisible),
    }"
  >
    <div
      class="flex items-center justify-between gap-x-2"
      :class="{ 'flex-wrap gap-y-4': !isMinScreenMD && !isHeaderScrolled }"
    >
      <NuxtLink
        to="/"
        class="rounded-sm ring-offset-1 focus:outline-none focus-visible:ring focus-visible:ring-pink -ms-2 inline-flex items-center hover:bg-yellow"
        :class="{
          'pe-3': !isHeaderScrolled || !isSearchRoute,
          'md:px-0': isSearchRoute,
        }"
      >
        <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
        <OpenverseLogoText
          v-if="!isHeaderScrolled"
          class="-ml-1 mt-1"
          :class="{ 'md:hidden': isSearchRoute }"
          width="95"
          height="15"
        />
      </NuxtLink>

      <VSearchBar
        v-show="!isHomeRoute"
        v-model.trim="searchTerm"
        class="mx-auto md:ms-0 md:me-auto lg:w-1/2 2xl:w-1/3"
        :class="{
          'order-4 w-full md:order-none md:w-auto': !isHeaderScrolled,
          'w-2/3': isHeaderScrolled,
        }"
        @submit="handleSearch"
      >
        <span
          v-if="searchStatus"
          class="info font-semibold text-xs text-dark-charcoal-70 group-hover:text-dark-charcoal group-focus:text-dark-charcoal mx-4"
        >
          {{ searchStatus }}
        </span>
      </VSearchBar>

      <!-- @todo: This ref should be on the button, but I can't get it to work -->
      <div ref="mobileDrawerTriggerRef">
        <VFilterButton
          v-show="isSearchRoute"
          :is-header-scrolled="isHeaderScrolled"
          :pressed="isFilterSidebarVisible || mobileDrawer === 'filters'"
          v-bind="triggerA11yProps"
          @toggle="
            mobileDrawer === null
              ? openMobileDrawer('filters')
              : closeMobileDrawer()
          "
        />
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Component
      :is="filterComponent"
      v-bind="options"
      @close="closeMobileDrawer"
    >
      <VSearchGridFilter
        v-show="mobileDrawer === 'filters'"
        @close="closeMobileDrawer"
      />
    </Component>
  </header>
</template>

<script>
import OpenverseLogoText from '~/assets/icons/openverse-logo-text.svg?inline'
import {
  computed,
  defineComponent,
  onMounted,
  provide,
  reactive,
  ref,
  useContext,
  useRouter,
  watch,
  watchEffect,
} from '@nuxtjs/composition-api'
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'
import { isMinScreen } from '~/composables/use-media-query'
import {
  useMatchSearchRoutes,
  useMatchHomeRoute,
} from '~/composables/use-match-routes'
import { useWindowScroll } from '~/composables/use-window-scroll'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'
import { FETCH_MEDIA, UPDATE_QUERY } from '~/constants/action-types'
import { AUDIO, IMAGE } from '~/constants/media'
import { MEDIA, SEARCH } from '~/constants/store-modules'

import closeIcon from '~/assets/icons/close.svg'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VModalContent from '~/components/VModal/VModalContent.vue'
import VSearchBar from '~/components/VHeader/VSearchBar/VSearchBar.vue'
import VSearchGridFilter from '~/components/VFilters/VSearchGridFilter.vue'
import VSidebarContent from '~/components/VHeader/VSidebarContent.vue'

const i18nKeys = {
  [AUDIO]: {
    noResult: 'browse-page.audio-no-results',
    result: 'browse-page.audio-result-count',
    more: 'browse-page.audio-result-count-more',
  },
  [IMAGE]: {
    noResult: 'browse-page.image-no-results',
    result: 'browse-page.image-result-count',
    more: 'browse-page.image-result-count-more',
  },
}

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VFilterButton,
    VLogoLoader,
    VSearchBar,
    VSearchGridFilter,
    OpenverseLogoText,
  },
  setup() {
    const { app, i18n, store } = useContext()
    const { isHeaderScrolled } = useWindowScroll()
    const { matches: isSearchRoute } = useMatchSearchRoutes()
    const { matches: isHomeRoute } = useMatchHomeRoute()
    const router = useRouter()
    const isMinScreenMD = isMinScreen('md', { shouldPassInSSR: true })
    const {
      isVisible: isFilterSidebarVisible,
      setVisibility: setFilterSidebarVisibility,
    } = useFilterSidebarVisibility({ mediaQuery: isMinScreenMD })

    provide('isHeaderScrolled', isHeaderScrolled)
    provide('isMdScreen', isMinScreenMD)

    /**
     * The state of the mobile drawer/popover menu.
     * Either closed or set as a string to show a particular section.
     * @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>}
     **/
    const mobileDrawer = ref(null)

    /** @type {import('@nuxtjs/composition-api').Ref<import('@nuxtjs/composition-api').Component>} */
    const filterComponent = ref(VModalContent)

    /**
     * @param {'filters'|'content-switcher'} menu
     */
    const openMobileDrawer = (menu) => {
      mobileDrawer.value = menu
    }

    /**
     * Return a text representation of the result count.
     * @param {number} count
     * @returns {string}
     */
    const mediaCount = (count) => {
      const countKey =
        count === 0 ? 'noResult' : count >= 10000 ? 'more' : 'result'
      const i18nKey = i18nKeys[store.state.search.query.mediaType][countKey]
      const localeCount = count.toLocaleString(i18n.locale)
      return i18n.tc(i18nKey, count, { localeCount })
    }

    /** @type {import('@nuxtjs/composition-api').ComputedRef<number>} */
    const resultsCount = computed(() => store.getters['media/results'].count)

    const closeMobileDrawer = () => {
      mobileDrawer.value = null
    }
    /**  @type {import('@nuxtjs/composition-api').ComputedRef<boolean>} */
    const isFetching = computed(() => {
      return store.getters['media/fetchState'].isFetching
    })

    // Mobile drawer menu stuff
    const mobileDrawerTriggerRef = ref(null)

    const triggerA11yProps = reactive({
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    })
    const { lock, unlock } = useBodyScrollLock({ mobileDrawerTriggerRef })

    watch([mobileDrawer], ([mobileDrawer]) => {
      const visible = mobileDrawer !== null
      triggerA11yProps['aria-expanded'] = visible
      setFilterSidebarVisibility(visible)
      if (isMinScreenMD) return
      visible ? lock() : unlock()
    })

    const mobileOptions = {
      visible: computed(() => mobileDrawer.value !== null),
      'trigger-element': computed(() => mobileDrawerTriggerRef?.value),
      hide: closeMobileDrawer,
      'aria-label': i18n.t('header.filter-button.simple'),
      mode: 'mobile',
    }

    const desktopOptions = {
      to: 'sidebar',
      visible: computed(() => mobileDrawer.value !== null),
    }

    /**
     * @type {Ref<{'trigger-element'?: ComputedRef<HTMLElement|null>,
     * hide?: close, visible: ComputedRef<boolean>,
     * 'aria-label'?: string,
     * to?: string, mode?: string}>}
     */
    const options = ref(mobileOptions)
    onMounted(() => {
      if (isMinScreenMD.value && isFilterSidebarVisible.value) {
        open()
      }
    })

    watch(
      [isMinScreenMD],
      ([isMinScreenMD]) => {
        filterComponent.value = isMinScreenMD ? VSidebarContent : VModalContent
        options.value = isMinScreenMD ? desktopOptions : mobileOptions
      },
      { immediate: true }
    )

    /**
     * Status is hidden below the medium breakpoint.
     * It shows Loading... or Number of results on bigger screens.
     * @returns {string}
     */
    const setInitialStatus = () => {
      if (!isMinScreenMD.value) return ''
      if (isFetching.value) return i18n.t('header.loading')
      return store.state.search.query.q === ''
        ? ''
        : mediaCount(resultsCount.value)
    }

    /** @type {import('@nuxtjs/composition-api').Ref<string>} */
    const searchStatus = ref(setInitialStatus())

    watchEffect(() => {
      if (isMinScreenMD.value) {
        searchStatus.value = isFetching.value
          ? i18n.t('header.loading')
          : mediaCount(resultsCount.value)
      } else {
        searchStatus.value = ''
      }
    })

    const localSearchTerm = ref(store.state.search.query.q)
    const searchTerm = computed({
      get: () => localSearchTerm.value,
      set: async (value) => {
        localSearchTerm.value = value
      },
    })

    watch(
      () => store.state.search.query.q,
      (newSearchTerm) => {
        if (newSearchTerm !== localSearchTerm.value) {
          localSearchTerm.value = newSearchTerm
        }
      }
    )

    const handleSearch = async () => {
      // Don't do anything if search term hasn't changed
      if (localSearchTerm.value === store.state.search.query.q) return

      await store.dispatch(`${SEARCH}/${UPDATE_QUERY}`, {
        q: localSearchTerm.value,
      })

      const searchType = store.state.search.searchType
      const newPath = app.localePath({
        path: `/search/${searchType === 'all' ? '' : searchType}`,
        query: store.getters['search/searchQueryParams'],
      })
      router.push(newPath)

      await store.dispatch(`${MEDIA}/${FETCH_MEDIA}`, {
        ...store.getters['search/searchQueryParams'],
      })
    }

    return {
      closeIcon,
      handleSearch,
      isFetching,
      isFilterSidebarVisible,
      isHeaderScrolled,
      isHomeRoute,
      isMinScreenMD,
      isSearchRoute,
      searchStatus,
      searchTerm,

      // Mobile drawer state
      mobileDrawer,
      mobileDrawerTriggerRef,
      closeMobileDrawer,
      openMobileDrawer,
      triggerA11yProps,
      filterComponent,
      options,
    }
  },
})

export default VHeader
</script>
