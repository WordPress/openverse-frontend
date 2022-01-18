<template>
  <NuxtLink
    v-slot="{ href }"
    itemprop="contentUrl"
    :to="localePath('/image/' + image.id)"
    :title="image.title"
    custom
  >
    <a
      :href="href"
      class="group focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-pink"
      @keydown.tab.prevent="onFocusLeave"
    >
      <figure
        itemprop="image"
        itemscope=""
        itemtype="https://schema.org/ImageObject"
        class="aspect-square relative"
      >
        <img
          ref="img"
          class="w-full h-full object-cover"
          loading="lazy"
          :alt="image.title"
          :src="getImageUrl(image)"
          :width="image.width"
          :height="image.height"
          itemprop="thumbnailUrl"
          @error="onImageLoadError($event, image)"
        />
        <figcaption
          class="absolute left-0 bottom-0 invisible group-hover:visible group-focus:visible bg-white p-1"
        >
          <span class="sr-only">{{ image.title }}</span>
          <VLicense
            :license="image.license"
            :bg-filled="true"
            :hide-name="true"
          />
        </figcaption>
      </figure>
    </a>
  </NuxtLink>
</template>

<script>
import VLicense from '~/components/License/VLicense.vue'
const errorImage = require('~/assets/image_not_available_placeholder.png')

const toAbsolutePath = (url, prefix = 'https://') => {
  if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
    return url
  }
  return `${prefix}${url}`
}

export default {
  name: 'VImageCell',
  components: { VLicense },
  props: ['image'],
  methods: {
    getImageUrl(image) {
      if (!image) return ''
      const url = image.thumbnail || image.url
      return toAbsolutePath(url)
    },
    getImageForeignUrl(image) {
      return toAbsolutePath(image.foreign_landing_url)
    },
    onImageLoadError(event, image) {
      const element = event.target
      if (element.src !== image.url) {
        element.src = image.url
      } else {
        element.src = errorImage
      }
    },
    onFocusLeave(event) {
      this.$emit('focus-leave', event)
    },
  },
}
</script>
