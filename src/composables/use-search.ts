import { computed, ref, useRouter, watch } from "@nuxtjs/composition-api"

import { useSearchStore } from "~/stores/search"
import { useMediaStore } from "~/stores/media"
import { useI18nResultsCount } from "~/composables/use-i18n-utilities"
import { useMatchSearchRoutes } from "~/composables/use-match-routes"
import { ALL_MEDIA } from "~/constants/media"

export const useSearch = () => {
  const mediaStore = useMediaStore()
  const searchStore = useSearchStore()
  const router = useRouter()

  const { matches: isSearchRoute } = useMatchSearchRoutes()

  const storeSearchTerm = computed(() => searchStore.searchTerm)
  /**
   * To update the local search term when the route changes, when, for example,
   * the user clicks the back button, we need to watch the store search term.
   */
  watch(storeSearchTerm, (newSearchTerm) => {
    searchTerm.value = newSearchTerm
  })

  const localSearchTerm = ref(storeSearchTerm.value)

  /**
   * Search term has a getter and setter to be used as a v-model.
   * To prevent sending unnecessary requests, we also keep track of whether
   * the search term was changed.
   */
  const searchTerm = computed({
    get: () => localSearchTerm.value,
    set: (value: string) => {
      localSearchTerm.value = value
    },
  })

  const searchTermChanged = computed(
    () => searchStore.searchTerm !== localSearchTerm.value
  )

  /**
   * Called when the 'search' button is clicked in the header.
   *
   * No op if the search term is blank.
   * If the search term hasn't changed from the store version, we do nothing on
   * a search route. On other routes, we set the search type to 'All content' and
   * reset the media.
   *
   * Then, we update the search term, and update the path.
   *
   * Updating the path causes the `search.vue` page's route watcher
   * to run and fetch new media.
   */
  const updateSearchState = () => {
    if (localSearchTerm.value === "") return
    if (!searchTermChanged.value && isSearchRoute) return
    if (!isSearchRoute) {
      searchStore.setSearchType(ALL_MEDIA)
      mediaStore.clearMedia()
    }

    const searchPath = searchStore.updateSearchPath({
      searchTerm: localSearchTerm.value,
    })
    router.push(searchPath)
  }

  const isFetching = computed(() => mediaStore.fetchState.isFetching)
  const resultsCount = computed(() => mediaStore.resultCount)

  const { getI18nCount, getLoading } = useI18nResultsCount()
  /**
   * Additional text at the end of the search bar.
   * Shows the loading state or result count.
   */
  const searchStatus = computed(() => {
    if (searchStore.searchTerm === "") return ""
    if (isFetching.value) return getLoading()
    return getI18nCount(resultsCount.value)
  })

  return {
    updateSearchState,
    searchTerm,
    searchStatus,
  }
}
