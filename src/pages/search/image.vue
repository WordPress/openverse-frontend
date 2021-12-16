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
import { defineComponent, computed } from '@nuxtjs/composition-api'

import { useLoadMore } from '~/composables/use-load-more'
import { isScreen } from '~/composables/use-media-query.js'

import VImageGrid from '~/components/VImageGrid/VImageGrid'

const ImageSearch = defineComponent({
  name: 'ImageSearch',
  components: {
    VImageGrid,
  },
  props: propTypes,
  setup(props) {
    const { canLoadMore, onLoadMore } = useLoadMore(props)

    const defaultWindow = typeof window !== 'undefined' ? window : undefined
    const isMdScreen = isScreen('md', defaultWindow)
    const is2XlScreen = isScreen('2xl', defaultWindow)

    const responsiveColumnCount = computed(() => {
      if (is2XlScreen.value) return 5
      if (isMdScreen.value) return 3
      if (!isMdScreen.value) return 1
      return 3
    })

    return { canLoadMore, onLoadMore, responsiveColumnCount }
  },
})

export default ImageSearch
</script>
