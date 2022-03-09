<template>
  <div dir="ltr">
    <div class="hero-section border-b">
      <div class="container pt-16">
        <div class="intro text-center mx-auto">
          <h2 class="text-5xl mb-10">
            {{ $t('extension.description.intro') }}
          </h2>
        </div>
        <ExtensionBrowsers />
        <video
          ref="heroVid"
          class="screenshot block w-full mx-auto"
          autoplay
          loop
          muted
          @click="togglePlay"
          @keyup.enter="togglePlay"
        >
          <source
            src="~/assets/screenshots/extension_hero_vid.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
    <div
      class="features grid grid-cols-1 tab:grid-cols-2 gap-x-12 gap-y-30 py-30 mx-auto"
    >
      <template v-for="(feature, index) in features">
        <figure
          :key="`figure-${index}`"
          :data-index="index"
          class="flex flex-col justify-center items-center"
          :style="{ '--cell-idx': index * 2 }"
        >
          <img
            class="screenshot w-full rounded border"
            :src="feature.image"
            :alt="$t(`extension.features.${feature.key}.heading`)"
          />
        </figure>
        <div
          :key="`description-${index}`"
          :data-index="index"
          class="description flex flex-col justify-center items-center"
          :style="{ '--cell-idx': index * 2 + 1 }"
        >
          <h2 class="text-5xl">
            {{ $t(`extension.features.${feature.key}.heading`) }}
          </h2>
          <p class="mt-4">
            {{ $t(`extension.features.${feature.key}.content`) }}
          </p>
        </div>
      </template>
    </div>
    <div class="section">
      <div class="container conclusion mb-24">
        <h2 class="text-center mx-auto">{{ $t('extension.conclusion') }}</h2>
        <ExtensionBrowsers class="mt-6" />
      </div>
    </div>
  </div>
</template>

<script>
import ExtensionBrowsers from '~/components/ExtensionBrowsers'

import feature1 from '~/assets/screenshots/extension_feat_1.png'
import feature2 from '~/assets/screenshots/extension_feat_2.png'
import feature3 from '~/assets/screenshots/extension_feat_3.png'

const AboutPage = {
  name: 'about-page',
  components: { ExtensionBrowsers },
  data() {
    const features = [
      { key: 'search', image: feature1 },
      { key: 'bookmark', image: feature2 },
      { key: 'use', image: feature3 },
    ]
    return {
      features,
      isPlaying: true,
    }
  },
  head() {
    return {
      title: `${this.$t('extension.title')} | Openverse`,
    }
  },
  methods: {
    togglePlay() {
      if (this.isPlaying) {
        this.$refs.heroVid.pause()
      } else {
        this.$refs.heroVid.play()
      }
      this.isPlaying = !this.isPlaying
    },
  },
}

export default AboutPage
</script>
