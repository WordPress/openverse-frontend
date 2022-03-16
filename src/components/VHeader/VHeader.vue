<template>
  <header
    class="flex px-4 md:px-7 items-center md:items-stretch z-40 w-screen bg-white gap-x-2 gap-y-4"
    :class="{
      'py-3 ': isHeaderScrolled,
      'py-4 flex-wrap md:flex-nowrap': !isHeaderScrolled,
      'border-b border-white': !isHeaderScrolled && !isMenuOpen,
      'border-b border-dark-charcoal-20':
        isSearchRoute && (isHeaderScrolled || isMenuOpen),
      'justify-between': isSearchRoute,
      'justify-between md:justify-start': !isSearchRoute,
      'flex-nowrap': !isSearchRoute && isHeaderScrolled,
    }"
  >
    <VLogoButton
      :is-fetching="isFetching"
      :is-header-scrolled="isHeaderScrolled"
      :is-search-route="isSearchRoute"
    />

    <VSearchBar
      v-model.trim="searchTerm"
      class="flex-grow lg:flex-grow-0 lg:w-1/2 2xl:w-1/3"
      :size="isMinScreenMd ? 'medium' : isHeaderScrolled ? 'small' : 'large'"
      :class="{
        'order-4 md:order-none w-full md:w-auto': !isHeaderScrolled,
        'search-bar-mobile-scrolled': isSearchRoute && isHeaderScrolled,
      }"
      @submit="handleSearch"
    >
      <span
        v-show="searchStatus"
        class="hidden lg:block info font-semibold text-xs text-dark-charcoal-70 group-hover:text-dark-charcoal group-focus:text-dark-charcoal mx-4"
      >
        {{ searchStatus }}
      </span>
    </VSearchBar>

    <VHeaderMenu
      :is-search-route="isSearchRoute"
      @open="openMenuModal(menus.CONTENT_SWITCHER)"
      @close="close()"
    />
    <VHeaderFilter
      v-if="isSearchRoute"
      @open="openMenuModal(menus.FILTERS)"
      @close="close()"
    />
  </header>
</template>

<script>
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  useContext,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'

import { MEDIA } from '~/constants/store-modules'
import { CLEAR_MEDIA, FETCH_MEDIA } from '~/constants/action-types'
import { ALL_MEDIA, supportedMediaTypes } from '~/constants/media'
import { isMinScreen } from '~/composables/use-media-query'
import { useMatchSearchRoutes } from '~/composables/use-match-routes'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'
import { useI18nResultsCount } from '~/composables/use-i18n-utilities'
import { useSearchStore } from '~/stores/search'

import VLogoButton from '~/components/VHeader/VLogoButton.vue'
import VHeaderFilter from '~/components/VHeader/VHeaderFilter.vue'
import VSearchBar from '~/components/VHeader/VSearchBar/VSearchBar.vue'
import VHeaderMenu from '~/components/VHeader/VHeaderMenu.vue'

import closeIcon from '~/assets/icons/close.svg'

const menus = {
  FILTERS: 'filters',
  CONTENT_SWITCHER: 'content-switcher',
}

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VLogoButton,
    VHeaderFilter,
    VHeaderMenu,
    VSearchBar,
  },
  setup() {
    const searchStore = useSearchStore()
    const { app, i18n, store } = useContext()
    const router = useRouter()

    const { matches: isSearchRoute } = useMatchSearchRoutes()

    const isHeaderScrolled = inject('isHeaderScrolled')
    const isMinScreenMd = isMinScreen('md', { shouldPassInSSR: true })
    const headerHasTwoRows = inject('headerHasTwoRows')
    provide('isMinScreenMd', isMinScreenMd)

    const menuModalRef = ref(null)

    const { isVisible: isFilterVisible } = useFilterSidebarVisibility()

    /**
     * Set the active mobile menu view to the 'filters'
     * if the filter sidebar has been toggled open.
     */
    watch([isFilterVisible], ([isFilterVisible]) => {
      openMenu.value = isFilterVisible ? menus.FILTERS : null
    })

    /**
     * @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>}
     */
    const openMenu = ref(null)
    const isMenuOpen = computed(() => openMenu.value !== null)

    /**
     * @param {'filters'|'content-switcher'} menuName
     */
    const openMenuModal = (menuName) => {
      if (openMenu.value !== null) {
        close()
      }
      openMenu.value = menuName
    }
    const close = () => {
      openMenu.value = null
    }

    /**  @type {import('@nuxtjs/composition-api').ComputedRef<boolean>} */
    const isFetching = computed(() => {
      return store.getters['media/fetchState'].isFetching
    })

    /** @type {import('@nuxtjs/composition-api').ComputedRef<number>} */
    const resultsCount = computed(() => store.getters['media/resultCount'])
    const { getI18nCount } = useI18nResultsCount()
    /**
     * Additional text at the end of the search bar.
     * Shows the loading state or result count.
     */
    const searchStatus = computed(() => {
      if (!isSearchRoute.value || searchStore.searchTerm === '') return ''
      if (isFetching.value) return i18n.t('header.loading')
      return getI18nCount(resultsCount.value)
    })

    /**
     * Search term has a getter and setter to be used as a v-model.
     * To prevent sending unnecessary requests, we also keep track of whether
     * the search term was changed.
     * @type {import('@nuxtjs/composition-api').WritableComputedRef<string>}
     */
    const searchTerm = computed({
      get: () => searchStore.searchTerm,
      set: (value) => {
        searchStore.setSearchTerm(value)
        searchTermChanged.value = true
      },
    })
    const searchTermChanged = ref(false)

    /**
     * If search term hasn't changed, don't do anything on a search route,
     * and change path to search path (all content types) from other pages.
     * If is search route and search term hasn't changed: return
     * If is not search route and search term hasn't changed: set the search type to all, set path.
     * If is search route and search term changed: set the query, set path
     * If is not search route, and search term changed: set search type to all, set query, set path
     */
    const handleSearch = async () => {
      const searchType = isSearchRoute.value
        ? useSearchStore().searchType
        : ALL_MEDIA
      if (
        isSearchRoute.value &&
        (!searchTermChanged.value || searchTerm.value === '')
      )
        return
      if (searchTermChanged.value) {
        await Promise.all(
          supportedMediaTypes.map((mediaType) =>
            store.dispatch(`${MEDIA}/${CLEAR_MEDIA}`, { mediaType })
          )
        )
        useSearchStore().setSearchType(searchType)
      }
      const newPath = app.localePath({
        path: `/search/${searchType === 'all' ? '' : searchType}`,
        query: searchStore.searchQueryParams,
      })
      router.push(newPath)
      await store.dispatch(`${MEDIA}/${FETCH_MEDIA}`, {
        ...searchStore.searchQueryParams,
      })
      searchTermChanged.value = false
    }

    return {
      closeIcon,
      isFetching,

      isHeaderScrolled,
      isMinScreenMd,
      isSearchRoute,
      headerHasTwoRows,

      menuModalRef,

      openMenu,
      openMenuModal,
      isMenuOpen,

      menus,
      close,

      handleSearch,
      searchStatus,
      searchTerm,
    }
  },
})

export default VHeader
</script>
