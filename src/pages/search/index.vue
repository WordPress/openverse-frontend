<template>
  <SearchGrid
    id="tab-image"
    role="tabpanel"
    aria-labelledby="image"
    @onLoadMoreImages="onLoadMoreImages"
  />
</template>

<script>
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
  methods: {
    onLoadMoreImages(searchParams) {
      this.$emit('onLoadMoreImages', searchParams)
    },
  },
}
</script>
