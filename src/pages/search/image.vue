<template>
  <ImageGrid
    :images="results"
    :can-load-more="canLoadMore"
    :fetch-state="fetchState"
    @load-more="onLoadMore"
  />
</template>

<script>
import { propTypes } from '~/pages/search/search-page.types'
import { computed, defineComponent, useMeta } from '@nuxtjs/composition-api'
import { useLoadMore } from '~/composables/use-load-more'
import { useSearchStore } from '~/stores/search'

const ImageSearch = defineComponent({
  name: 'ImageSearch',
  props: propTypes,
  setup(props) {
    const searchStore = useSearchStore()

    const query = computed(() => searchStore.query.q)
    useMeta({ title: `${query.value} - Openverse` })

    const results = computed(() =>
      Object.values(props.mediaResults?.image?.items ?? [])
    )
    const { canLoadMore, onLoadMore } = useLoadMore(props)
    return { canLoadMore, onLoadMore, results }
  },
  head: {},
})

export default ImageSearch
</script>
