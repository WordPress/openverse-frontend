<template>
  <div
    class="fixed flex px-8 align-center z-40 w-full bg-white"
    :class="{ 'border-b border-dark-charcoal-20': isHeaderScrolled }"
  >
    <NuxtLink to="/">
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>
    <VSearchBar
      v-model.trim="searchTerm"
      class="search-bar"
      @submit="handleSearch"
      >{{ searchStatus }}</VSearchBar
    >
    <VButton
      v-if="!!currentOverlay"
      variant="action-menu"
      class="self-center"
      @click="closeOverlay"
    >
      <span class="text-sr">{{ $t('modal.close') }}</span>
      <VIcon :icon-path="closeIcon" />
    </VButton>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRouter,
  watchEffect,
} from '@nuxtjs/composition-api'

import { MEDIA, SEARCH } from '~/constants/store-modules'
import { FETCH_MEDIA, UPDATE_QUERY } from '~/constants/action-types'
import { AUDIO, IMAGE } from '~/constants/media'
import { isScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'

import closeIcon from '~/assets/icons/close.svg'

import VIcon from '~/components/VIcon/VIcon.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VSearchBar from '~/components/VHeader/VSearchBar/VSearchBar.vue'

const searchRoutes = ['search', 'search-image', 'search-audio', 'search-video']
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
    VIcon,
    VLogoLoader,

    VSearchBar,
  },
  setup() {
    const { app, i18n, store } = useContext()
    const router = useRouter()

    const isMdScreen = isScreen('md')
    /** @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>} */
    const currentOverlay = ref(null)
    const { isSearch } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()

    // /**
    //  * When an overlay is opened on mobile, this sets the current overlay name
    //  * @param {'filters'|'content-switcher'} overlay
    //  */
    // // eslint-disable-next-line no-unused-vars
    // const setCurrentOverlay = (overlay) => {
    //   // Overlay can only be set on mobile screen
    //   if (isMdScreen.value) return
    //   currentOverlay.value = overlay
    // }
    const closeOverlay = () => {
      currentOverlay.value = null
    }

    router.beforeEach((to, from, next) => {
      isSearch.value = searchRoutes.includes(to.name)
      next()
    })

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

    /**  @type {import('@nuxtjs/composition-api').ComputedRef<Boolean>} */
    // @todo: fix
    const isFetching = computed(() => true)

    /** @type {import('@nuxtjs/composition-api').ComputedRef<number>} */
    const resultsCount = computed(() => store.getters['media/results'].count)

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

    return {
      closeIcon,
      closeOverlay,
      currentOverlay,
      handleSearch,
      isFetching,
      isHeaderScrolled,
      isSearch,
      searchStatus,
      searchTerm,
    }
  },
})

export default VHeader
</script>
