<template>
  <VImageGrid
    :images="mediaResults.items"
    :can-load-more="canLoadMore"
    :fetch-state="fetchState"
    :columns="responsiveColumnCount"
    @load-more="onLoadMore"
  />
</template>

<script>
import { propTypes } from '~/pages/search/search-page.types'
import { defineComponent } from '@nuxtjs/composition-api'
import { useLoadMore } from '~/composables/use-load-more'
import VImageGrid from '~/components/VImageGrid/VImageGrid.vue'

const SearchIndex = defineComponent({
  name: 'SearchIndex',
  components: {
    VImageGrid,
  },
  props: propTypes,
  setup(props) {
    const { canLoadMore, onLoadMore } = useLoadMore(props)
    return { canLoadMore, onLoadMore, responsiveColumnCount: 3 }
  },
})
export default SearchIndex
</script>
