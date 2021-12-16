<template>
  <figure
    itemprop="image"
    itemscope=""
    itemtype="https://schema.org/ImageObject"
    class="group"
  >
    <NuxtLink
      itemprop="contentUrl"
      :to="localePath('/image/' + image.id)"
      :title="image.title"
      @click="onGotoDetailPage($event, image)"
    >
      <img
        ref="img"
        loading="lazy"
        :alt="image.title"
        :src="getImageUrl(image)"
        :width="image.width"
        :height="image.height"
        itemprop="thumbnailUrl"
        @error="onImageLoadError($event, image)"
      />
    </NuxtLink>
    <figcaption
      class="absolute left-0 bottom-0 hidden group-hover:visible bg-white p-1"
    >
      <VLicense :license="image.license" :bg-filled="true" :hide-name="true" />
    </figcaption>
  </figure>
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
  name: 'ImageCell',
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
    onGotoDetailPage(event, image) {
      if (!event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        const detailRoute = this.localeRoute({
          name: 'photo-detail-page',
          params: { id: image.id, location: window.scrollY },
        })
        this.$router.push(detailRoute)
      }
    },
    onImageLoadError(event, image) {
      const element = event.target
      if (element.src !== image.url) {
        element.src = image.url
      } else {
        element.src = errorImage
      }
    },
  },
}
</script>
