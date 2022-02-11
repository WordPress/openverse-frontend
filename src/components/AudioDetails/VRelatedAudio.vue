<template>
  <aside :aria-label="$t('audio-details.related-audios')">
    <h4 class="text-base lg:text-3xl mb-6">
      {{ $t('audio-details.related-audios') }}
    </h4>
    <template v-if="!$fetchState.error">
      <VAudioTrack
        v-for="audio in audios"
        :key="audio.id"
        :audio="audio"
        layout="row"
        :size="audioTrackSize"
        class="mb-12"
      />
      <LoadingIcon v-show="$fetchState.pending" />
    </template>
    <p v-show="!!$fetchState.error">
      {{ $t('media-details.related-error') }}
    </p>
  </aside>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { AUDIO } from '~/constants/media'

import useRelated from '~/composables/use-related'
import { isMinScreen } from '@/composables/use-media-query'

export default {
  name: 'VRelatedAudio',
  props: {
    audioId: {
      type: String,
      required: true,
    },
    service: {},
  },
  /**
   * Fetches related audios on `audioId` change
   * @param {object} props
   * @param {string} props.audioId
   * @param {any} props.service
   * @return {{ audios: Ref<AudioDetail[]> }}
   */
  setup(props) {
    const mainAudioId = ref(props.audioId)
    const relatedOptions = {
      mediaType: AUDIO,
      mediaId: mainAudioId,
    }
    // Using service prop to be able to mock when testing
    if (props.service) {
      relatedOptions.service = props.service
    }

    const isMinScreenLg = isMinScreen('lg', { shouldPassInSSR: true })
    const audioTrackSize = computed(() => {
      return isMinScreenLg.value ? 'l' : 's'
    })

    const { media: audios } = useRelated(relatedOptions)
    return { audioTrackSize, audios }
  },
}
</script>
