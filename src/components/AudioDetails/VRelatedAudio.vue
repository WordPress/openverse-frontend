<template>
  <aside :aria-label="$t('photo-details.aria.related')">
    <h4 class="b-header mb-6">
      {{ $t('audio-details.related-audios') }}
    </h4>
    <template v-if="!error">
      <VAudioTrack
        v-for="audio in media"
        :key="audio.id"
        :audio="audio"
        layout="row"
        size="m"
        class="mb-12"
      />
      <LoadingIcon v-if="pending" />
    </template>
    <p v-else>
      {{ $t('media-details.related-error') }}
    </p>
  </aside>
</template>

<script>
import { ref } from '#app'
import { AUDIO } from '~/constants/media'
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
   * @return {{ audios: import('#app').Ref<AudioDetail[]> }}
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
    const { media, pending, error } = useRelated(relatedOptions)
    return { media, pending, error }
  },
}
</script>
