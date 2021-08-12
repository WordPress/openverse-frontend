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
  name: 'ImageSearch',
  head() {
    return {
      title: this.$t('seo.titles.search', {
        media: this.$t('media-types.image'),
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
