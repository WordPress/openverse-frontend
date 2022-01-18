<template>
  <div>
    <div
      class="results-grid grid grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 gap-4 mb-4"
    >
      <NuxtLink
        v-for="[key, item] in results"
        :key="key"
        :to="{ path: `/search/${key}`, query: $route.query }"
        class="lg:col-span-2"
      >
        <VContentLink :results-count="item.count" :media-type="key" />
      </NuxtLink>
    </div>
    <GridSkeleton v-if="organizedMedia.length === 0" is-for-tab="all" />
    <div
      v-else
      class="results-grid grid grid-cols-2 lg:grid-cols-5 2xl:grid-cols-6 gap-4"
    >
      <div
        v-for="item in organizedMedia"
        :key="item.id"
        class="rounded-sm overflow-hidden"
      >
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
      :disabled="resultsLoading"
      class="mt-4"
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
import { ALL_MEDIA } from '~/constants/media'

export default defineComponent({
  name: 'VAllResultsGrid',
  components: { VImageCell, VAudioCell, VLoadMore },
  props: ['canLoadMore'],
  setup(_, { emit }) {
    const { i18n, store } = useContext()

    const onLoadMore = () => {
      emit('load-more')
    }

    const resultsLoading = computed(() => {
      return (
        store.state.media.fetchState[ALL_MEDIA].fetchingError ||
        store.state.media.fetchState[ALL_MEDIA].isFetching ||
        Object.keys(store.state.media.results[ALL_MEDIA].items).length === 0
      )
    })

    const organizedMedia = computed(() => {
      if (resultsLoading.value) return []
      const media = store.state.media.results[ALL_MEDIA].items ?? {}
      const mediaKeys = Object.keys(media)

      // Seed the random number generator with the ID of
      // the first and last search result, so the non-image
      // distribution is the same on repeated searches
      const firstID = Object.keys(media[mediaKeys[0]])[0]
      const lastID = Object.keys(media[mediaKeys[mediaKeys.length - 1]]).pop()
      const rand = srand(firstID + lastID)
      const randomIntegerInRange = (min, max) =>
        Math.floor(rand() * (max - min + 1)) + min

      const newResults = []
      // first push all images to the results list
      for (const id of Object.keys(media['image'])) {
        const item = media['image'][id]
        item.frontendMediaType = 'image'
        newResults.push(item)
      }

      // push other items into the list, using a random index.
      let nonImageIndex = 1
      for (const type of Object.keys(media).slice(1)) {
        for (const id of Object.keys(media[type])) {
          const item = media[type][id]
          item.frontendMediaType = type
          newResults.splice(nonImageIndex, 0, item)
          if (nonImageIndex > Object.keys(media['image']).length + 1) break
          nonImageIndex = randomIntegerInRange(
            nonImageIndex + 1,
            nonImageIndex + 6
          )
        }
      }

      return newResults
    })

    const isError = computed(
      () => !!store.state.media.fetchState[ALL_MEDIA].fetchingError
    )

    const fetchState = computed(() => {
      return store.state.media.fetchState[ALL_MEDIA]
    })

    const errorHeader = computed(() => {
      const type = i18n.t('browse-page.search-form.audio')
      return i18n.t('browse-page.fetching-error', { type })
    })

    const results = computed(() =>
      Object.entries(store.state.media.results).slice(1)
    )

    return {
      isError,
      errorHeader,
      organizedMedia,
      onLoadMore,
      fetchState,
      resultsLoading,
      results,
    }
  },
})
</script>
