<template>
  <VSkipToContentContainer
    class="browse-page flex flex-col w-full px-4 md:px-10"
  >
    <VSearchGrid
      :fetch-state="fetchState"
      :query="query"
      :supported="supported"
      :search-type="searchType"
      :results-count="resultsCount"
      data-testid="search-grid"
    >
      <template #media>
        <NuxtChild
          :key="$route.path"
          :result-items="resultItems"
          :fetch-state="fetchState"
          :is-filter-visible="isVisible"
          :search-term="query.q"
          :supported="supported"
          data-testid="search-results"
        />
      </template>
    </VSearchGrid>
    <VScrollButton v-show="showScrollButton" data-testid="scroll-button" />
    <VModal
      v-if="selectedResult !== null && modalIsOpen"
      :displaced-disclosure="modalDisclosure"
      :visible="true"
      @close="handleModalClose"
    >
      <VImageResult v-if="selectedResultType === 'image'" />
    </VModal>
  </VSkipToContentContainer>
</template>

<script>
import { isShallowEqualObjects } from '@wordpress/is-shallow-equal'
import {
  defineComponent,
  computed,
  inject,
  useRouter,
  useRoute,
  watch,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'

import { supportedSearchTypes } from '~/constants/media'
import { isMinScreen } from '~/composables/use-media-query'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import { useMediaStore } from '~/stores/media'
import { useSearchStore } from '~/stores/search'
import { useSingleResultStore } from '~/stores/media/single-result'

import VSearchGrid from '~/components/VSearchGrid.vue'
import VSkipToContentContainer from '~/components/VSkipToContentContainer.vue'
import VScrollButton from '~/components/VScrollButton.vue'
import VModal from '~/components/VModal/VModal.vue'

const BrowsePage = defineComponent({
  name: 'BrowsePage',
  components: {
    VScrollButton,
    VSearchGrid,
    VSkipToContentContainer,
    VModal,
  },
  beforeRouteLeave(to, from, next) {
    const resultRoute = /^(image|audio)-id___\w{2}$/
    const match = to.name.match(resultRoute)
    if (match) {
      if (!this.searchHomeRoute) {
        this.searchHomeRoute = from.fullPath
      }

      const singleResultStore = useSingleResultStore(this.$pinia)
      singleResultStore.fetchMediaItem(match[1], to.params.id).then(() => {
        this.modalDisclosure = this.$el.querySelector(
          `[data-resultid="${to.params.id}"`
        )
        this.modalIsOpen = true
        window.history.pushState({ prev: from.path }, '', to.path)
      })
      return false
    }

    console.log('ELSE:', to)
  },
  scrollToTop: false,
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isMinScreenMd = isMinScreen('md')
    const { isVisible } = useFilterSidebarVisibility()
    const showScrollButton = inject('showScrollButton')
    const mediaStore = useMediaStore()
    const searchStore = useSearchStore()
    const singleResultStore = useSingleResultStore()

    const selectedResult = computed(() => singleResultStore.mediaItem)
    const selectedResultType = computed(() => singleResultStore.mediaType)
    const searchTerm = computed(() => searchStore.searchTerm)
    const searchType = computed(() => searchStore.searchType)
    const query = computed(() => searchStore.searchQueryParams)
    const supported = computed(() =>
      supportedSearchTypes.includes(searchType.value)
    )
    const resultCount = computed(() => mediaStore.resultCount)
    const fetchState = computed(() => mediaStore.fetchState)
    const resultItems = computed(() => mediaStore.resultItems)

    const searchHomeRoute = ref()
    const modalIsOpen = ref(false)
    const popstateHandler = ref()

    const handleModalClose = () => {
      router.push(searchHomeRoute.value)
      modalIsOpen.value = false
      modalDisclosure.value = null
    }

    watch([route], () => {
      if (route.value.name.startsWith('search')) {
        handleModalClose()
      }
    })

    onMounted(() => {
      window.addEventListener('popstate', () => {
        console.log('popstate', window.location.toString())
        if (window.location.pathname.includes('search')) {
          handleModalClose()
        }
      })
    })

    const modalDisclosure = ref()

    return {
      isMinScreenMd,
      isVisible,
      showScrollButton,
      searchTerm,
      searchType,
      supported,
      query,

      selectedResult,
      selectedResultType,
      resultCount,
      fetchState,
      resultItems,
      fetchMedia: mediaStore.fetchMedia,
      setSearchStateFromUrl: searchStore.setSearchStateFromUrl,

      searchHomeRoute,
      handleModalClose,
      modalDisclosure,
      modalIsOpen,
      popstateHandler,
    }
  },
  asyncData({ route, $pinia }) {
    if (process.server) {
      const searchStore = useSearchStore($pinia)
      searchStore.setSearchStateFromUrl({
        path: route.path,
        urlQuery: route.query,
      })
    }
  },
  async fetch() {
    if (this.supported && !this.resultCount && this.searchTerm.trim() !== '') {
      await this.fetchMedia()
    }
  },
  computed: {
    /**
     * Number of search results. Returns 0 for unsupported types.
     * @returns {number}
     */
    resultsCount() {
      return this.supported ? this.resultCount : 0 ?? 0
    },
  },
  watch: {
    /**
     * Updates the search type only if the route's path changes.
     * @param {import('@nuxt/types').Context['route']} newRoute
     * @param {import('@nuxt/types').Context['route']} oldRoute
     */
    async $route(newRoute, oldRoute) {
      if (
        newRoute.path !== oldRoute.path ||
        !isShallowEqualObjects(newRoute.query, oldRoute.query)
      ) {
        const { query, path } = newRoute
        await this.setSearchStateFromUrl({ urlQuery: query, path })
        this.fetchMedia()
      }
    },
  },
})

export default BrowsePage
</script>
