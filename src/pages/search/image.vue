<template>
  <VImageGrid
    :images="results"
    :can-load-more="canLoadMore"
    :fetch-state="fetchState"
    @load-more="onLoadMore"
  />
</template>

<script>
import { propTypes } from '~/pages/search/search-page.types'

import VImageGrid from '~/components/VImageGrid/VImageGrid.vue'

const ImageSearch = defineComponent({
  name: 'ImageSearch',
  components: { VImageGrid },
  props: propTypes,
  setup(props) {
    useMeta({ title: `${props.searchTerm} | Openverse` })

    const results = computed(() => props.resultItems.image)
    const { canLoadMore, onLoadMore } = useLoadMore(props)
    return { canLoadMore, onLoadMore, results }
  },
  head: {},
})

export default ImageSearch
</script>
