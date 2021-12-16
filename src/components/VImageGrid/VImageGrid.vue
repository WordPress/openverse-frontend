<template>
  <section class="px-4">
    <div
      class="image-grid pb-8"
      :style="{ '--columns': columns, '--gutter': '12px' }"
    >
      <div
        v-for="(column, index) in imageColumns"
        :key="index"
        class="image-column"
      >
        <VImageCell
          v-for="(image, imgIndex) in column"
          :key="imgIndex"
          :ref="
            (el) => {
              if (el && imgIndex === column.length - 1) {
                lastImageRefs[index] = el
              }
            }
          "
          :image="image"
        />
      </div>
    </div>
    <h5 v-if="isError" class="py-4">
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
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onUpdated,
  ref,
  useContext,
} from '@nuxtjs/composition-api'

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
      default: 5,
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

    // Collect a ref of each image that's the last of its column
    const lastImageRefs = ref([])

    // make sure to reset the refs before each update
    onBeforeUpdate(() => {
      lastImageRefs.value = []
    })

    onUpdated(() => {
      console.log('last image refs!')
      // console.log(lastImageRefs)
    })

    const onLoadMore = () => {
      emit('load-more')
    }

    return {
      isError,
      fetchingErrorHeading,
      imageColumns,
      onLoadMore,
      lastImageRefs,
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

.image-grid .image-column {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: var(--gutter);
}

.image-grid .image-column img {
  width: 100%;
  height: auto;
  background-color: lightgray;
}
</style>
