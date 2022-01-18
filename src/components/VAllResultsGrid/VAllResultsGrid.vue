<template>
  <div>
    <!-- <pre style="height: 200px; background: grey; overflow-y: scroll">
      {{ JSON.stringify(media, null, 2) }}
    </pre> -->
    <div class="grid grid-cols-4 grid-rows-4">
      <div v-for="item in organizedMedia" :key="item.id">
        <VImageCell
          v-if="item.frontendMediaType === 'image'"
          :key="item.id"
          :image="item"
        />
        <VAudioCell
          v-if="item.frontendMediaType === 'audio'"
          :key="item.id"
          :audio="item"
        />
      </div>
    </div>

    <template v-if="isError" class="m-auto w-1/2 text-center pt-6">
      <h5>{{ errorHeader }}</h5>
      <p>{{ fetchState.fetchingError }}</p>
    </template>

    <VLoadMore
      v-if="canLoadMore && !fetchState.isFinished"
      :is-fetching="fetchState.isFetching"
      data-testid="load-more"
      @onLoadMore="onLoadMore"
    />
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'

import VImageCell from '~/components/VAllResultsGrid/VImageCell.vue'
import VAudioCell from '~/components/VAllResultsGrid/VAudioCell.vue'
import VLoadMore from '~/components/VLoadMore.vue'

import srand from '~/utils/srand'

export default defineComponent({
  name: 'VAllResultsGrid',
  components: { VImageCell, VAudioCell, VLoadMore },
  props: {
    media: {
      default: () => [],
    },
    canLoadMore: {
      type: Boolean,
      default: true,
    },
    fetchState: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const { i18n } = useContext()

    const onLoadMore = () => {
      emit('load-more')
    }

    const organizedMedia = computed(() => {
      // Seed the random number generator with the ID of
      // the first and last search result, so the non-image
      // distribution is the same on repeated searches
      let mediaKeys = Object.keys(props.media)
      const firstID = Object.keys(props.media[mediaKeys[0]])[0]
      const lastID = Object.keys(
        props.media[mediaKeys[mediaKeys.length - 1]]
      ).pop()
      const rand = srand(firstID + lastID)
      const randomIntegerInRange = (min, max) =>
        Math.floor(rand() * (max - min + 1)) + min

      const newResults = []
      // first push all images to the results list
      for (const id of Object.keys(props.media['image'])) {
        const item = props.media['image'][id]
        item.frontendMediaType = 'image'
        newResults.push(item)
      }

      // push other items into the list, using a random index.
      let nonImageIndex = 1
      for (const type of Object.keys(props.media).slice(1)) {
        for (const id of Object.keys(props.media[type])) {
          const item = props.media[type][id]
          item.frontendMediaType = type
          newResults.splice(nonImageIndex, 0, item)
          if (nonImageIndex > Object.keys(props.media['image']).length + 1)
            break
          nonImageIndex = randomIntegerInRange(
            nonImageIndex + 1,
            nonImageIndex + 6
          )
        }
      }

      return newResults
    })

    const isError = computed(() => !!props.fetchState.fetchingError)
    const errorHeader = computed(() => {
      const type = i18n.t('browse-page.search-form.audio')
      return i18n.t('browse-page.fetching-error', { type })
    })

    return {
      onLoadMore,
      isError,
      errorHeader,
      organizedMedia,
    }
  },
})
</script>
