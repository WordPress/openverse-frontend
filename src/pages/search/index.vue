<template>
  <SearchGrid
    id="tab-all"
    role="tabpanel"
    aria-labelledby="all"
    @onLoadMoreImages="onLoadMoreImages"
  />
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/store-modules/action-types'
import { ALL_MEDIA } from '~/constants/media'

export default {
  name: 'SearchIndex',
  head() {
    return {
      title: this.$t('seo.titles.search', {
        media: this.$t('media-types.all'),
        query: this.$store.state.query.q,
      }),
    }
  },
  async mounted() {
    await this.$store.dispatch(UPDATE_SEARCH_TYPE, { searchType: ALL_MEDIA })
  },
  methods: {
    onLoadMoreImages(searchParams) {
      this.$emit('onLoadMoreItems', searchParams)
    },
  },
}
</script>
