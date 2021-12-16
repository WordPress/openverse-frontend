<template>
  <section>
    <div
      class="image-grid"
      :style="{ '--columns': columns, '--gutter': '12px' }"
    >
      <div v-for="(column, index) in imageColumns" :key="index" class="column">
        <VImageCell
          v-for="(image, imgIndex) in column"
          :key="imgIndex"
          :image="image"
        />
      </div>
    </div>
    <h5 v-if="isError" class="image-grid__notification py-4">
      {{ fetchState.fetchingError }}
    </h5>
    <LoadMoreButton
      v-if="canLoadMore"
      :is-error="isError"
      :is-fetching="fetchState.isFetching"
      :is-finished="fetchState.isFinished"
      data-testid="load-more"
      @onLoadMore="onLoadMore"
    />
  </section>
</template>

<script>
/**
 * This component receives an array of images as prop, and
 * is responsible for displaying them as a grid.
 * It can also fetch more images when 'Load More' clicked,
 * or display 'No More Media'.
 * Used to display both image search results, and related images.
 */
import LoadMoreButton from '~/components/ImageGrid/LoadMoreButton'
import VImageCell from '~/components/VImageGrid/VImageCell'

export default {
  name: 'VImageGrid',
  components: { LoadMoreButton, VImageCell },
  props: {
    images: {
      default: () => [],
    },
    canLoadMore: {
      type: Boolean,
      default: true,
    },
    fetchState: {
      required: true,
    },
    columns: {
      type: Number,
      default: 6,
    },
  },
  computed: {
    isError() {
      return !!this.fetchState.fetchingError
    },
    fetchingErrorHeading() {
      const type = this.$t('browse-page.search-form.image')
      return this.$t('browse-page.fetching-error', { type })
    },
    imageColumns() {
      const makeArr = (length) => new Array(length).fill()
      const cols = makeArr(this.columns).map(() => [])

      if (!this.images) return cols

      let activeCol = 1
      Object.values(this.images).forEach((image) => {
        cols[activeCol - 1].push(image)
        activeCol = activeCol < cols.length ? activeCol + 1 : 1
      })
      return cols
    },
  },
  methods: {
    onLoadMore() {
      this.$emit('load-more')
    },
  },
}
</script>

<style>
.image-grid {
  grid-column-gap: var(--gutter);
  align-items: start;
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  column-gap: var(--gutter);
}

.image-grid .column {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: var(--gutter);
}

.image-grid .column img {
  width: 100%;
  height: auto;
  background-color: lightgray;
}
</style>
