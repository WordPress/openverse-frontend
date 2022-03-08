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
    return {
      shouldPersistMedia: true,
      page: pagesPerMediaType.reduce(
        (pages, [mediaType, page]) =>
          page ? { ...pages, [mediaType]: page + 1 } : pages,
        /** @type {{ [key: import('../store/types').MediaType]: number }} */ {}
      ),
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
