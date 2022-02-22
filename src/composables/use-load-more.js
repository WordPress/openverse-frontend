import { computed, useContext } from '@nuxtjs/composition-api'
import { FETCH_MEDIA } from '~/constants/action-types'
import { MEDIA } from '~/constants/store-modules'

/**
 * Fetches media on 'Load More' button click.
 *
 * @param {import('../pages/search/search-page.types').Props} props
 * @returns {{ onLoadMore: ((function(): Promise<void>)|void), canLoadMore: import('@nuxtjs/composition-api').ComputedRef<boolean>}}
 */
export const useLoadMore = ({ searchResultItems, searchTerm }) => {
  const { store } = useContext()

  const searchParams = computed(() => {
    const pages = {}
    Object.keys(searchResultItems).forEach((mediaType) => {
      const mediaPage = store.state.media.results[mediaType].page || 0
      pages[mediaType] = mediaPage ? mediaPage + 1 : undefined
    })
    return {
      page: pages,
      shouldPersistMedia: true,
    }
  })

  const canLoadMore = computed(() => {
    return searchTerm.trim() !== ''
  })

  const onLoadMore = async () => {
    if (canLoadMore.value) {
      await store.dispatch(`${MEDIA}/${FETCH_MEDIA}`, searchParams.value)
    }
  }

  return { canLoadMore, onLoadMore }
}
