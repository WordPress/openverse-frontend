import { computed } from '@nuxtjs/composition-api'

import { useMediaStore } from '~/stores/media'

/**
 * Fetches media on 'Load More' button click.
 *
 * @param {import('../pages/search/search-page.types').propTypes} props
 * @param {import('~/models/media').SupportedSearchType} searchType
 * @returns {{ onLoadMore: ((function(): Promise<void>)|void), canLoadMore: import('@nuxtjs/composition-api').ComputedRef<boolean>}}
 */
export const useLoadMore = (props, searchType) => {
  /**
   * We show 'Load More' button if:
   * - there is a search query (`searchTerm` is not blank)
   * - fetchState is either idle or successful
   * - there is at least 1 result for current search type.
   * @type {import('@nuxtjs/composition-api').ComputedRef<boolean>}
   */
  const canLoadMore = computed(() => {
    return (
      props.searchTerm.trim() !== '' &&
      props.fetchState.canFetch &&
      props.resultItems[searchType].length > 0
    )
  })

  const onLoadMore = async () => {
    const mediaStore = useMediaStore()
    if (canLoadMore.value) {
      await mediaStore.fetchMedia({
        shouldPersistMedia: true,
      })
    }
  }

  return { canLoadMore, onLoadMore }
}
