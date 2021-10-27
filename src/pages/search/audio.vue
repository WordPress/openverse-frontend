<template>
  <section>
    <div class="px-6 pt-6">
      <AudioTrack
        v-for="audio in mediaResults.items"
        :key="audio.id"
        :audio="audio"
        :size="audioTrackSize"
        layout="row"
      />
    </div>

    <template v-if="isError" class="m-auto w-1/2 text-center pt-6">
      <h5>{{ errorHeader }}</h5>
      <p>{{ fetchState.fetchingError }}</p>
    </template>
    <LoadMoreButton
      :is-error="isError"
      :is-fetching="fetchState.isFetching"
      :is-finished="isFinished"
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
    isFinished: {
      type: Boolean,
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
