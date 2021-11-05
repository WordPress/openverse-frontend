<template>
  <div class="global-track flex flex-row w-full">
    <div class="flex-shrink-0">
      <AudioThumbnail :audio="audio" />
      <slot name="play-pause" />
    </div>

    <div class="relative flex-grow">
      <div
        class="absolute inset-x-0 z-10 top-4 px-4 flex flex-row items-center justify-between"
      >
        <p class="text-sr font-semibold">{{ audio.title }}</p>
        <button @click="handleClose">
          <VIcon :icon-path="closeIcon" />
        </button>
      </div>

      <slot name="controller" :waveform-props="{ 'usable-frac': 0.5 }" />
    </div>
  </div>
</template>

<script>
import { useStore } from '@nuxtjs/composition-api'

import AudioThumbnail from '~/components/AudioThumbnail/AudioThumbnail.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

import closeIcon from '~/assets/icons/close.svg'

import { ACTIVE } from '~/constants/store-modules.js'
import { STOP_ACTIVE_MEDIA_ITEM } from '~/constants/mutation-types.js'

export default {
  name: 'Global',
  components: {
    VIcon,
    AudioThumbnail,
  },
  props: ['audio'],
  setup() {
    const store = useStore()

    const handleClose = () => {
      store.commit(`${ACTIVE}/${STOP_ACTIVE_MEDIA_ITEM}`)
    }

    return {
      closeIcon,
      handleClose,
    }
  },
}
</script>

<style>
.global-track .play-pause,
.global-track .thumbnail {
  @apply h-14 w-14;
}

.global-track .audio-controller {
  @apply absolute inset-0;
}

.global-track .waveform {
  @apply h-full;
}
</style>
