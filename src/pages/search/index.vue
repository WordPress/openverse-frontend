<template>
  <ImageGrid
    :images="mediaResults.items"
    :can-load-more="true"
    :fetch-state="fetchState"
    @load-more="onLoadMore"
  />
</template>

<script>
export default {
  name: 'SearchIndex',
  props: {
    mediaResults: {},
    fetchState: {},
    isFinished: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onLoadMore() {
      const searchParams = {
        page: this.mediaResults.page + 1,
        shouldPersistMedia: true,
      }
      this.$emit('load-more', searchParams)
    },
  },
}
</script>
