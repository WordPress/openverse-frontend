<template>
  <ImageGrid
    :images="mediaResults.items"
    :can-load-more="canLoadMore"
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
    searchTerm: {
      type: String,
      required: true,
    },
  },
  computed: {
    canLoadMore() {
      return this.searchTerm.trim() !== ''
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
