<template>
  <aside :aria-label="$t('audio-details.related-audios')">
    <h4 class="text-base lg:text-3xl mb-6">
      {{ $t('audio-details.related-audios') }}
    </h4>
    <div
      v-if="!fetchState.fetchingError"
      class="flex flex-col gap-8 lg:gap-12 mb-12"
    >
      <VAudioTrack
        v-for="audio in media"
        :key="audio.id"
        :audio="audio"
        layout="row"
        :size="audioTrackSize"
      />
      <LoadingIcon v-show="fetchState.isFetching" />
    </div>
    <p v-show="!!fetchState.fetchingError">
      {{ $t('media-details.related-error') }}
    </p>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { isMinScreen } from '~/composables/use-media-query'
import { FetchState } from '~/composables/use-fetch-state'
import { AudioDetail } from '~/models/media'

import LoadingIcon from '~/components/LoadingIcon.vue'
import VAudioTrack from '~/components/VAudioTrack/VAudioTrack.vue'

export default defineComponent({
  name: 'VRelatedAudio',
  components: { VAudioTrack, LoadingIcon },
  props: {
    media: {
      type: Array as PropType<AudioDetail[]>,
      required: true,
    },
    fetchState: {
      type: Object as PropType<FetchState>,
      required: true,
    },
  },
  /**
   * Fetches related audios on `audioId` change
   */
  setup() {
    const isMinScreenMd = isMinScreen('md', { shouldPassInSSR: true })
    const audioTrackSize = computed(() => {
      return isMinScreenMd.value ? 'l' : 's'
    })
    return { audioTrackSize }
  },
})
</script>
