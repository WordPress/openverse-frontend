<template>
  <aside :aria-label="$t('photo-details.aria.related')">
    <h4 class="b-header mb-6">
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
import { isMinScreen } from '~/composables/use-media-query'
import useRelated from '~/composables/use-related'

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
    const isMinScreenMd = isMinScreen('md', { shouldPassInSSR: false })
    const audioTrackSize = computed(() => {
      return !isMinScreenMd.value ? 's' : 'm'
    })

    const mainAudioId = ref(props.audioId)
    const relatedOptions = {
      mediaType: AUDIO,
      mediaId: mainAudioId,
    }
    // Using service prop to be able to mock when testing
    if (props.service) {
      relatedOptions.service = props.service
    }
    const { media: audios } = useRelated(relatedOptions)
    return { audios, audioTrackSize }
  },
}
</script>
