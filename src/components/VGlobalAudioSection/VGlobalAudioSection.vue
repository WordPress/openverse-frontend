<template>
  <div class="global-audio sticky sm:hidden bottom-0">
    <VGlobalAudioTrack v-if="audio" layout="global" :audio="audio" />
    <VIconButton
      v-if="audio"
      class="absolute top-0 rtl:left-0 ltr:right-0 border-none z-10"
      :icon-props="{ iconPath: icons.closeIcon }"
      @click="handleClose"
    />
  </div>
</template>

<script>
import { useStore, useRoute, watch, computed } from '@nuxtjs/composition-api'

import closeIcon from '~/assets/icons/close-small.svg'
import { useActiveAudio } from '~/composables/use-active-audio'

import { useActive } from '@/store/active'

export default {
  name: 'VGlobalAudioSection',
  setup() {
    const store = useStore()
    const activeStore = useActive()
    const route = useRoute()

    const activeAudio = useActiveAudio()

    /* Active audio track */

    const audio = computed(() => {
      const trackId = activeStore.id
      if (trackId) {
        return store.state.media.results.audio.items[trackId]
      }
      return null
    })

    /* Message */

    const handleError = (event) => {
      const error = event.target.error
      let errorMsg
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMsg = 'err_aborted'
          break
        case error.MEDIA_ERR_NETWORK:
          errorMsg = 'err_network'
          break
        case error.MEDIA_ERR_DECODE:
          errorMsg = 'err_decode'
          break
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = 'err_unsupported'
          break
      }
      activeStore.setMessage({ message: errorMsg })
    }

    watch(
      activeAudio.obj,
      (audio, _, onInvalidate) => {
        if (!audio) return
        audio.addEventListener('error', handleError)

        onInvalidate(() => {
          audio.removeEventListener('error', handleError)
        })
      },
      { immediate: true }
    )

    const handleClose = activeStore.ejectActiveMediaItem

    /* Router observation */

    const routeName = computed(() => route.value.name)
    watch(routeName, (routeNameVal, oldRouteNameVal) => {
      if (
        oldRouteNameVal.includes('audio') &&
        !routeNameVal.includes('audio')
      ) {
        activeAudio.obj.value?.pause()
        activeStore.ejectActiveMediaItem()
      }
    })

    return {
      icons: {
        closeIcon,
      },

      audio,

      handleError,
      handleClose,
    }
  },
}
</script>
