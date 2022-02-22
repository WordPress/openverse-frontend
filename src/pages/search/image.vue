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
import {
  computed,
  defineComponent,
  useMeta,
  useContext,
} from '@nuxtjs/composition-api'
import { useLoadMore } from '~/composables/use-load-more'

const ImageSearch = defineComponent({
  name: 'ImageSearch',
  props: propTypes,
  setup(props) {
    const { i18n } = useContext()

    useMeta({ title: `${props.searchTerm} - ${i18n.t('hero.brand')}` })

    const results = computed(() => props.searchResultItems?.image ?? [])

    const { canLoadMore, onLoadMore } = useLoadMore(props)
    return { canLoadMore, onLoadMore, results }
  },
  head: {},
})

export default ImageSearch
</script>
