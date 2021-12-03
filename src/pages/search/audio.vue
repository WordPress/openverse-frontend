<template>
  <section>
    <AudioTrack
      v-for="audio in mediaResults.items"
      :key="audio.id"
      class="px-6 mb-6"
      :audio="audio"
      :size="audioTrackSize"
      layout="row"
    />

    <template v-if="isError" class="m-auto w-1/2 text-center pt-6">
      <h5>{{ errorHeader }}</h5>
      <p>{{ fetchState.fetchingError }}</p>
    </template>
    <LoadMoreButton
      v-if="shouldShowLoadMore"
      :is-error="isError"
      :is-fetching="fetchState.isFetching"
      :is-finished="fetchState.isFinished"
      media-type="audio"
      data-testid="load-more"
      @onLoadMore="onLoadMore"
    />
  </section>
</template>

<script>
export default {
  name: 'AudioSearch',
  props: {
    mediaResults: {},
    fetchState: {},
    isFilterVisible: {},
    searchTerm: {
      type: String,
      required: true,
    },
  },
  computed: {
    audioTrackSize() {
      return this.isFilterVisible ? 'm' : 's'
    },
    isError() {
      return !!this.fetchState.fetchingError
    },
    typeString() {
      return this.$t('browse-page.search-form.audio')
    },
    errorHeader() {
      return this.$t('browse-page.fetching-error', {
        type: this.typeString,
      })
    },
    shouldShowLoadMore() {
      return this.searchTerm.trim() !== ''
    },
  },
  methods: {
    onLoadMore() {
      if (!this.supported) return
      const searchParams = {
        page: this.mediaResults.page + 1,
        shouldPersistMedia: true,
      }
      this.$emit('load-more', searchParams)
    },
  },
}
</script>
