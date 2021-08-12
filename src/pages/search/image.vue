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
      title: `Image results for "${this.$store.state.query.q}" on Openverse`,
    }
  },
  methods: {
    onLoadMoreImages(searchParams) {
      this.$emit('onLoadMoreImages', searchParams)
    },
  },
}
</script>
