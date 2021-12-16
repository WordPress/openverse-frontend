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
    <VLoadMore
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
import VLoadMore from '~/components/VLoadMore'
import VImageCell from '~/components/VImageGrid/VImageCell'
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'VImageGrid',
  components: { VLoadMore, VImageCell },
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
  setup(props, { emit }) {
    const { i18n } = useContext()

    const isError = computed(() => {
      return !!props.fetchState.fetchingError
    })
    const fetchingErrorHeading = computed(() => {
      const type = i18n.t('browse-page.search-form.image')
      return i18n.t('browse-page.fetching-error', { type })
    })

    const imageColumns = computed(() => {
      const makeArr = (length) => new Array(length).fill()
      const cols = makeArr(props.columns).map(() => [])

      if (!props.images) return cols

      let activeCol = 1
      Object.values(props.images).forEach((image) => {
        cols[activeCol - 1].push(image)
        activeCol = activeCol < cols.length ? activeCol + 1 : 1
      })
      return cols
    })

    const onLoadMore = () => {
      emit('load-more')
    }

    return {
      isError,
      fetchingErrorHeading,
      imageColumns,
      onLoadMore,
    }
  },
})
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
