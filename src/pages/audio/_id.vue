<template>
  <main class="relative">
    <div class="w-full p-2">
      <VBackToSearchResultsLink />
    </div>
    <VAudioTrack layout="full" :audio="audio" class="main-track" />
    <div
      class="mt-10 lg:mt-16 flex flex-col gap-10 lg:gap-16 px-4 lg:px-0 lg:max-w-5xl mx-auto"
    >
      <VMediaReuse data-testid="audio-attribution" :media="audio" />
      <VAudioDetails data-testid="audio-info" :audio="audio" />
      <VRelatedAudio v-if="audio.id" :audio-id="audio.id" />
    </div>
  </main>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'

import { AUDIO } from '~/constants/media'

import { useMediaItemStore } from '~/stores/media/media-item'

import VAudioDetails from '~/components/VAudioDetails/VAudioDetails.vue'
import VAudioTrack from '~/components/VAudioTrack/VAudioTrack.vue'
import VBackToSearchResultsLink from '~/components/VBackToSearchResultsLink.vue'
import VRelatedAudio from '~/components/VAudioDetails/VRelatedAudio.vue'
import VMediaReuse from '~/components/VMediaInfo/VMediaReuse.vue'

const AudioDetailPage = {
  name: 'AudioDetailPage',
  components: {
    VAudioDetails,
    VAudioTrack,
    VBackToSearchResultsLink,
    VMediaReuse,
    VRelatedAudio,
  },
  data() {
    return {
      showBackToSearchLink: false,
    }
  },
  watch: {
    audio(newAudio) {
      this.id = newAudio.id
    },
  },
  async asyncData({ route, error, app, $pinia }) {
    try {
      const mediaItemStore = useMediaItemStore($pinia)
      await mediaItemStore.fetchMediaItem({
        id: route.params.id,
        type: AUDIO,
      })
      const audio = mediaItemStore.mediaItem
      return {
        audio,
      }
    } catch (err) {
      error({
        statusCode: 404,
        message: app.i18n.t('error.media-not-found', {
          mediaType: AUDIO,
          id: route.params.id,
        }),
      })
    }
  },
  beforeRouteEnter(to, from, nextPage) {
    nextPage((_this) => {
      if (
        from.name === _this.localeRoute({ path: '/search/' }).name ||
        from.name === _this.localeRoute({ path: '/search/audio' }).name
      ) {
        _this.showBackToSearchLink = true
      }
    })
  },
  head() {
    const title = this.audio.title
    return {
      title: `${title} | Openverse`,
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
}

export default AudioDetailPage
</script>
<style>
.audio-page {
  --wp-max-width: 940px;
}
.audio-page section,
.audio-page aside {
  max-width: var(--wp-max-width);
  margin-right: auto;
  margin-left: auto;
}
.audio-page .full-track .mx-16 {
  @apply mt-6;
  @apply px-4 md:px-0;
  max-width: var(--wp-max-width);
  margin-right: auto;
  margin-left: auto;
}
</style>
