<template>
  <div
    class="sticky top-0 flex py-4 px-6 md:px-7 align-center justify-between z-40 w-full bg-white"
    :class="{
      'border-b': true,
      'border-white': !isHeaderScrolled && !isFilterSidebarVisible,
      'border-dark-charcoal-20': isHeaderScrolled || isFilterSidebarVisible,
    }"
  >
    <NuxtLink
      to="/"
      class="rounded-sm ring-offset-1 focus:outline-none focus-visible:ring focus-visible:ring-pink"
    >
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>

    <VSearchBar
      v-if="isSearch"
      v-model.trim="searchTerm"
      class="search-bar"
      @submit="handleSearch"
    >
      {{ searchStatus }}
    </VSearchBar>

    <VFilterButton
      v-if="isSearch"
      :is-header-scrolled="isHeaderScrolled"
      :pressed="isFilterSidebarVisible"
      @toggle="toggleFilterVisibility"
    />
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRouter,
  watch,
  watchEffect,
} from '@nuxtjs/composition-api'

import { MEDIA, SEARCH } from '~/constants/store-modules'
import { FETCH_MEDIA, UPDATE_QUERY } from '~/constants/action-types'
import { AUDIO, IMAGE } from '~/constants/media'
import { isScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import closeIcon from '~/assets/icons/close.svg'

import VSearchBar from '~/components/VHeader/VSearchBar/VSearchBar.vue'
import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'

// const searchRoutes = ['search', 'search-image', 'search-audio', 'search-video']
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
  },
  setup() {
    const { app, i18n, store } = useContext()
    const { isSearch } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()
    const router = useRouter()
    const isMdScreen = isScreen('md')
    const { isFilterSidebarVisible, setFilterSidebarVisibility } =
      useFilterSidebarVisibility({ mediaQuery: isMdScreen })

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

    /**  @type {import('@nuxtjs/composition-api').ComputedRef<boolean>} */
    const isFetching = computed(() => {
      return store.getters['media/fetchState'].isFetching
    })

    /**
     * Status is blank on mobile screen.
     * It shows Loading... or Number of results on bigger screens.
     * @returns {string}
     */
    const setInitialStatus = () => {
      if (!isMdScreen.value) return ''
      if (isFetching.value) return i18n.t('header.loading')
      return store.state.search.query.q === ''
        ? ''
        : mediaCount(resultsCount.value)
    }

    /** @type {import('@nuxtjs/composition-api').Ref<string>} */
    const searchStatus = ref(setInitialStatus())

    watchEffect(() => {
      if (isMdScreen.value) {
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

    /**
     * Set the active mobile menu view to the 'filters'
     * if the filter sidebar has been toggled open.
     *
     * @todo: There may be a better way to explain this
     */
    watch(
      () => isFilterSidebarVisible.value,
      (isVisible) => {
        if (isVisible) {
          setCurrentOverlay('filters')
        } else {
          closeOverlay()
        }
      }
    )

    const toggleFilterVisibility = () => {
      setFilterSidebarVisibility(!isFilterSidebarVisible.value)
    }

    /** @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>} */
    const currentOverlay = ref(null)
    /**
     * When an overlay is opened on mobile, this sets the current overlay name
     * @param {'filters'|'content-switcher'} overlay
     */
    const setCurrentOverlay = (overlay) => {
      // Overlay can only be set on mobile screen
      if (isMdScreen.value) return
      currentOverlay.value = overlay
    }
    const closeOverlay = () => {
      currentOverlay.value = null
    }

    return {
      closeIcon,
      closeOverlay,
      currentOverlay,
      handleSearch,
      isFetching,
      isFilterSidebarVisible,
      isHeaderScrolled,
      isSearch,
      searchStatus,
      searchTerm,
      setCurrentOverlay,
      toggleFilterVisibility,
    }
  },
})

export default VHeader
</script>
