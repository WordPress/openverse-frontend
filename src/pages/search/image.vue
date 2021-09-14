<template>
  <SearchGrid
    id="tab-image"
    role="tabpanel"
    aria-labelledby="image"
    @onLoadMoreImages="onLoadMoreImages"
  />
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/store-modules/action-types'
import { IMAGE } from '~/constants/media'

export default {
  name: 'ImageSearch',
  head() {
    return {
      title: this.$t('seo.titles.search', {
        media: this.$t('media-types.image'),
        query: this.$store.state.query.q,
      }),
    }
  },
  async mounted() {
    await this.$store.dispatch(UPDATE_SEARCH_TYPE, { searchType: IMAGE })
  },
  methods: {
    onLoadMoreImages(searchParams) {
      this.$emit('onLoadMoreItems', searchParams)
    },
  },
}
</script>
