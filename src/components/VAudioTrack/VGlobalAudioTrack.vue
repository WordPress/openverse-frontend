<template>
  <div
    class="audio-track"
    :aria-label="$t('audio-track.aria-label').toString()"
    role="region"
  >
    <Component :is="layoutComponent" :audio="audio" :size="size">
      <template #controller="waveformProps">
        <VWaveform
          v-bind="waveformProps"
          :peaks="audio.peaks"
          :current-time="currentTime"
          :duration="duration"
          :message="message ? $t(`audio-track.messages.${message}`) : null"
          @seeked="handleSeeked"
          @toggle-playback="handleToggle"
        />
      </template>

      <template #play-pause="playPauseProps">
        <VPlayPause
          :status="status"
          v-bind="playPauseProps"
          @toggle="handleToggle"
        />
      </template>
    </Component>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
} from '@nuxtjs/composition-api'

import { useActiveAudio } from '~/composables/use-active-audio'
import { defaultRef } from '~/composables/default-ref'

import { useActiveMediaStore } from '~/stores/active-media'

import type { AudioLayout, AudioSize } from '~/constants/audio'
import type { AudioDetail } from '~/models/media'

import VPlayPause from '~/components/VAudioTrack/VPlayPause.vue'
import VWaveform from '~/components/VAudioTrack/VWaveform.vue'
import VFullLayout from '~/components/VAudioTrack/layouts/VFullLayout.vue'
import VRowLayout from '~/components/VAudioTrack/layouts/VRowLayout.vue'
import VBoxLayout from '~/components/VAudioTrack/layouts/VBoxLayout.vue'
import VGlobalLayout from '~/components/VAudioTrack/layouts/VGlobalLayout.vue'

/**
 * Displays the waveform and basic information about the track, along with
 * controls to play, pause or seek to a point on the track.
 */
export default defineComponent({
  name: 'VGlobalAudioTrack',
  components: {
    VPlayPause,
    VWaveform,

    // Layouts
    VFullLayout,
    VRowLayout,
    VBoxLayout,
    VGlobalLayout,
  },
  props: {
    /**
     * the information about the track, typically from a track's detail endpoint
     */
    audio: {
      type: Object as PropType<AudioDetail>,
      required: true,
    },
    /**
     * the arrangement of the contents on the canvas; This determines the
     * overall L&F of the audio component.
     */
    layout: {
      type: String as PropType<AudioLayout>,
      default: 'full',
    },
    /**
     * the size of the component; Both 'box' and 'row' layouts offer multiple
     * sizes to choose from.
     */
    size: {
      type: String as PropType<AudioSize>,
      default: 'm',
    },
  },
  setup(props) {
    const activeMediaStore = useActiveMediaStore()
    const activeAudio = useActiveAudio()

    const status = ref('paused')
    const currentTime = ref(0)
    const duration = defaultRef(() => {
      if (typeof props.audio?.duration === 'number')
        return props.audio.duration / 1e3
      return 0
    })

    const setPlaying = () => {
      status.value = 'playing'
      updateTimeLoop()
    }
    const setPaused = () => (status.value = 'paused')
    const setPlayed = () => (status.value = 'played')

    const setTimeWhenPaused = (event: Event) => {
      if (status.value !== 'playing' && event.target) {
        currentTime.value = (event.target as HTMLAudioElement).currentTime ?? 0
        if (status.value === 'played') {
          // Set to pause to remove replay icon
          status.value = 'paused'
        }
      }
    }
    const setDuration = () => {
      if (activeAudio.obj.value) duration.value = activeAudio.obj.value.duration
    }

    const updateTimeLoop = () => {
      if (activeAudio.obj.value && status.value === 'playing') {
        currentTime.value = activeAudio.obj.value.currentTime
        window.requestAnimationFrame(updateTimeLoop)
      }
    }

    watch(
      activeAudio.obj,
      (audio, _, onInvalidate) => {
        if (!audio) return
        audio.addEventListener('play', setPlaying)
        audio.addEventListener('pause', setPaused)
        audio.addEventListener('ended', setPlayed)
        audio.addEventListener('timeupdate', setTimeWhenPaused)
        audio.addEventListener('durationchange', setDuration)
        currentTime.value = audio.currentTime
        duration.value = audio.duration

        /**
         * By the time the `activeAudio` is updated and a rerender
         * happens (triggering this watch function), all the events
         * we've registered above will already have fired, so we
         * need to derive the current status of the audio from the
         * `paused` and `ended` booleans on the audio object.
         *
         * In practice this will always result in the status being
         * set to `playing` as the active audio is only updated when
         * a new track is set to play. But for good measure we might
         * as well do this robustly and make sure that the status is
         * always synced any time the active audio hangs.
         */
        if (audio.paused) {
          if (audio.ended) {
            setPlayed()
          } else {
            setPaused()
          }
        } else {
          setPlaying()
        }

        onInvalidate(() => {
          audio.removeEventListener('play', setPlaying)
          audio.removeEventListener('pause', setPaused)
          audio.removeEventListener('ended', setPlayed)
          audio.removeEventListener('timeupdate', setTimeWhenPaused)
          audio.removeEventListener('durationchange', setDuration)
        })
      },
      { immediate: true }
    )

    const play = () => activeAudio.obj.value?.play()
    const pause = () => activeAudio.obj.value?.pause()

    /* Timekeeping */
    const message = computed(() => activeMediaStore.message)

    /* Interface with VPlayPause */

    const handleToggle = (state: 'playing' | 'paused') => {
      if (!state) {
        switch (status.value) {
          case 'playing':
            state = 'paused'
            break
          case 'paused':
          case 'played':
            state = 'playing'
            break
        }
      }

      switch (state) {
        case 'playing':
          play()
          break
        case 'paused':
          pause()
          break
      }
    }

    /* Interface with VWaveform */

    const handleSeeked = (frac: number) => {
      if (activeAudio.obj.value) {
        activeAudio.obj.value.currentTime = frac * duration.value
      }
    }

    /* Layout */

    const layoutMappings = {
      full: 'VFullLayout',
      row: 'VRowLayout',
      box: 'VBoxLayout',
      global: 'VGlobalLayout',
    }
    const layoutComponent = computed(() => layoutMappings[props.layout])

    return {
      status,
      message,
      handleToggle,
      handleSeeked,

      currentTime,
      duration,

      layoutComponent,
    }
  },
})
</script>
