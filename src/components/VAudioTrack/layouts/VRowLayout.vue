<template>
  <!-- `pages/search/audio` has negative margin `-mx-4` to compensate for this padding. -->
  <article
    class="row-track grid p-2 text-dark-charcoal-70 hover:bg-dark-charcoal-06 md:p-4"
    :class="`size-${size}`"
  >
    <div
      class="row-track-thumbnail flex-shrink-0 overflow-hidden rounded-sm w-18 h-18"
      :class="{'md:w-26 md:h-26': isLarge }"
    >
      <VAudioThumbnail :audio="audio" />
    </div>
    <div class="block md:hidden play-tiny z-10">
      <slot name="play-pause" size="tiny" layout="row" :is-tabbable="false" />
    </div>

    <div
      class="row-track-title decoration-inherit description-bold md:heading-6 md:leading-none  rounded-sm p-px text-dark-charcoal line-clamp-2 hover:text-dark-charcoal focus:outline-none focus:ring focus:ring-pink group-hover:underline md:line-clamp-1"
    >
      {{ audio.title }}
    </div>
    <div
      class="row-track-details flex flex-col gap-y-2 caption-regular md:description-regular"
      :class="{'flex-col gap-y-2 md:flex-row md:items-center' : isLarge }"
    >
        <i18n
          tag="div"
          path="audio-track.creator"
          :class="{ 'flex md-dot-after': isLarge}"
        ><template #creator>{{ audio.creator }}</template>
        </i18n>

      <div class="flex items-center ">
        <span
          class="flex md:hidden dot-after"
          ><span class="flex rounded-sm bg-dark-charcoal-06 p-1 time text-dark-charcoal">{{ timeFmt(audio.duration || 0, true) }}</span
        ></span>

        <span v-if="audio.category" class="flex dot-after">{{ $t(`filters.audio-categories.${audio.category}`) }}</span>

        <p class="inline-flex items-center gap-x-2">
          <VLicense :license="audio.license" />
          <span class="hidden md:inline-flex" aria-hidden>{{ licenseName }}</span>
        </p>
      </div>
    </div>
    <div class="row-track-controller hidden flex-row md:flex">
      <slot
        name="play-pause"
        :size="isLarge ? 'large' : 'larger'"
        :layout="'row'"
        :is-tabbable="false"
      />
      <slot
        name="controller"
        :features="features"
        :feature-notices="featureNotices"
        :is-tabbable="false"
      />
    </div>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { timeFmt } from '~/utils/time-fmt'
import type { AudioDetail } from '~/models/media'
import type { AudioSize } from '~/constants/audio'

import { getFullLicenseName } from "~/utils/license"

import { useI18n } from "~/composables/use-i18n"

import VAudioThumbnail from '~/components/VAudioThumbnail/VAudioThumbnail.vue'
import VLicense from '~/components/VLicense/VLicense.vue'


export default defineComponent({
  name: 'VRowLayout',
  components: {
    VAudioThumbnail,
    VLicense,
  },
  props: {
    audio: {
      type: Object as PropType<AudioDetail>,
      required: true,
    },
    size: {
      type: String as PropType<AudioSize>,
      required: false,
    },
  },
  setup(props) {
    const i18n = useI18n()

    const featureNotices: {
      timestamps?: string
      duration?: string
      seek?: string
    } = {}
    const features = ['timestamps', 'duration', 'seek']

    const isMedium = computed(() => props.size === 'm')
    const isLarge = computed(() => props.size === 'l')

    const licenseName = computed(() => getFullLicenseName(props.audio.license, '', i18n))


    return {
      timeFmt,

      features,
      featureNotices,

      licenseName,
      isMedium,
      isLarge,
    }
  },
})
</script>

<style>
.row-track .play-pause {
  @apply flex-shrink-0 rounded-ts-sm rounded-bs-sm;
}

.row-track .waveform {
  @apply flex-grow;
  --waveform-background-color: theme('colors.tx');
}

.row-track .waveform {
  @apply rounded-te-sm rounded-be-sm;
}

.row-track.size-m .waveform {
  @apply h-18;
}

.row-track.size-l .waveform {
  @apply h-14;
}

.dot-after {
  @apply after:content-[''] after:mx-2 after:inline-flex after:self-center after:bg-dark-charcoal-70 after:w-1 after:h-1 after:rounded-sm;
}
.md-dot-after {
  @apply md:after:content-[''] md:after:mx-2 md:after:inline-flex md:after:self-center md:after:bg-dark-charcoal-70 md:after:w-1 md:after:h-1 md:after:rounded-sm;
}
.dot-before {
  @apply before:content-[''] before:mx-2 before:inline-flex before:self-center before:bg-dark-charcoal-70 before:w-1 before:h-1 before:rounded-sm;
}

.row-track {
  display: grid;
  grid-template-columns: 4.6875rem 1fr;
  grid-template-rows: auto auto;
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;
  grid-template-areas: 'thumbnail title' 'thumbnail details';
}
.row-track-thumbnail {
  grid-area: thumbnail;
}
.play-tiny {
  grid-area: thumbnail;
  margin-top: calc(75px - 1.5rem);
  margin-inline-start: calc(75px - 1.5rem);
}
.row-track-title {
  grid-area: title;
}
.row-track-details {
  grid-area: details;
}
.row-track-controller {
  grid-area: thumbnail;
}
@media (min-width: 768px) {
  .row-track.size-m {
    grid-template-columns: 4.6875rem 17.5rem 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'thumbnail title controller' 'thumbnail details controller';
  }

  .row-track.size-l {
    grid-template-columns: 7.25rem 1fr;
    grid-column-gap: 1.5rem;
    grid-template-areas: 'thumbnail title' 'thumbnail details' 'thumbnail controller';
  }
  .row-track-controller {
    grid-area: controller;
  }
  .size-m .row-track-controller {
    @apply ps-2;
  }
}
</style>
