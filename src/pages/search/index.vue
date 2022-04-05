<template>
  <VAllResultsGrid :can-load-more="canLoadMore" @load-more="onLoadMore" />
</template>

<script>
import { useMeta, defineComponent } from '@nuxtjs/composition-api'

import { propTypes } from '~/pages/search/search-page.types'
import { useLoadMore } from '~/composables/use-load-more'
import { ALL_MEDIA } from '~/constants/media'

import VAllResultsGrid from '~/components/VAllResultsGrid/VAllResultsGrid.vue'

const SearchIndex = defineComponent({
  name: 'SearchIndex',
  components: { VAllResultsGrid },
  props: propTypes,
  setup(props) {
    useMeta({ title: `${props.searchTerm} | Openverse` })

    const { canLoadMore, onLoadMore } = useLoadMore(props, ALL_MEDIA)
    return { canLoadMore, onLoadMore }
  },
  head: {
    meta: [
      {
        hid: 'robots',
        name: 'robots',
        content: 'noindex',
      },
    ],
  },
})
export default SearchIndex
</script>
