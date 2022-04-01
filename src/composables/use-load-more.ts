import { computed, ComputedRef } from '@nuxtjs/composition-api'

import { useMediaStore } from '~/stores/media'
import type { SearchPageProps } from '~/pages/search/search-page'

export interface UseLoadMore {
  onLoadMore: () => Promise<void> | void
  canLoadMore: ComputedRef<boolean>
}
/**
 * Fetches media on 'Load More' button click.
 */
export const useLoadMore = (props: SearchPageProps): UseLoadMore => {
  const canLoadMore = computed(() => {
    return props.searchTerm?.trim() !== ''
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
