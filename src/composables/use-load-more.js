import { computed, useContext } from '@nuxtjs/composition-api'

import { FETCH_MEDIA } from '~/constants/action-types'
import { MEDIA } from '~/constants/store-modules'

/**
 * Fetches media on 'Load More' button click.
 *
 * @param {import('../pages/search/search-page.types').Props} props
 * @returns {{ onLoadMore: ((function(): Promise<void>)|void), canLoadMore: import('@nuxtjs/composition-api').ComputedRef<boolean>}}
 */
export const useLoadMore = ({ searchTerm }) => {
  const { store } = useContext()

  const searchParams = computed(() => {
    const pagesPerMediaType = store.getters['media/pagesPerMediaType']
    /** @type {{ [key: import('../store/types').MediaType]: number }} */
    const pages = {}
    for (let [mediaType, page] of pagesPerMediaType) {
      const mediaPage = page || 0
      if (mediaPage) {
        pages[mediaType] = mediaPage + 1
      }
    }
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
