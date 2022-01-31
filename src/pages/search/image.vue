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
import { computed, defineComponent, useNuxt2Meta as useMeta } from '#app'
import { useStore } from '~/composables/use-store'
import { useI18n } from '~/composables/use-i18n'
import { useLoadMore } from '~/composables/use-load-more'

const ImageSearch = defineComponent({
  name: 'ImageSearch',
  props: propTypes,
  setup(props) {
    const store = useStore()
    const i18n = useI18n()

    const query = computed(() => store.state.search.query.q)
    useMeta({ title: `${query.value} - ${i18n.t('hero.brand')}` })

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
