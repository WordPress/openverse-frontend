<template>
  <aside :aria-label="$t('photo-details.aria.related')">
    <h4 class="b-header mb-6">
      {{ $t('audio-details.related-audios') }}
    </h4>
    <template v-if="!$fetchState.error">
      <AudioTrack
        v-for="audio in audios"
        :key="audio.id"
        :audio="audio"
        layout="row"
        size="m"
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
import { defineComponent } from '#app'
import { AUDIO } from '~/constants/media'
import { fetchRelated } from '~/data/fetch-related'

export default defineComponent({
  name: 'RelatedAudios',
  props: {
    audioId: {
      type: String,
      required: true,
    },
    service: {},
  },
  data() {
    return { audios: [] }
  },
  fetch() {
    fetchRelated(this, 'audios', {
      mediaType: AUDIO,
      mediaId: this.$props.audioId,
    })
  },
})
</script>
