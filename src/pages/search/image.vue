<template>
  <VImageGrid
    :images="mediaResults.items"
    :can-load-more="canLoadMore"
    :fetch-state="fetchState"
    @load-more="onLoadMore"
  />
</template>

<script>
import { propTypes } from '~/pages/search/search-page.types'
import { defineComponent } from '@nuxtjs/composition-api'
import { useLoadMore } from '~/composables/use-load-more'
import VImageGrid from '~/components/VImageGrid/VImageGrid'

const ImageSearch = defineComponent({
  name: 'ImageSearch',
  components: {
    VImageGrid,
  },
  props: propTypes,
  setup(props) {
    const { canLoadMore, onLoadMore } = useLoadMore(props)
    return { canLoadMore, onLoadMore }
  },
})

export default ImageSearch
</script>
