<template>
  <VLink
    :href="'/image/' + image.id"
    class="w-full block group relative overflow-hidden rounded-sm focus:ring-[3px] focus:ring-pink focus:ring-offset-[3px] focus:outline-none bg-dark-charcoal-10 text-dark-charcoal-10"
    :aria-label="image.title"
    :style="`width: ${containerAspect * widthBasis}px;flex-grow: ${
      containerAspect * widthBasis
    }`"
    @click="onGotoDetailPage($event)"
    @keydown.native.shift.tab.exact="$emit('shift-tab', $event)"
  >
    <figure
      class="absolute w-full"
      :style="`width: ${imageWidth}%; top: ${imageTop}%; left:${imageLeft}%;`"
    >
      <img
        ref="img"
        loading="lazy"
        class="margin-auto block w-full"
        :alt="image.title"
        :src="getImageUrl(image)"
        :width="imgWidth"
        :height="imgHeight"
        @load="getImgDimension"
        @error="onImageLoadError($event)"
      />
      <figcaption
        class="absolute left-0 bottom-0 invisible group-hover:visible group-focus:visible bg-white p-1 text-dark-charcoal"
      >
        <span class="sr-only">{{ image.title }}</span>
        <VLicense :license="image.license" :hide-name="true" />
      </figcaption>
    </figure>
    <i :style="`padding-bottom:${iPadding}%`" class="block" aria-hidden />
  </VLink>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'

import type { ImageDetail } from '~/models/media'

import VLicense from '~/components/VLicense/VLicense.vue'
import VLink from '~/components/VLink.vue'

import errorImage from '~/assets/image_not_available_placeholder.png'

const minAspect = 3 / 4
const maxAspect = 16 / 9
const panaromaAspect = 21 / 9
const minRowWidth = 450
const widthBasis = minRowWidth / maxAspect

const toAbsolutePath = (url, prefix = 'https://') => {
  if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
    return url
  }
  return `${prefix}${url}`
}

export default defineComponent({
  name: 'VImageCell',
  components: { VLicense, VLink },
  props: {
    image: {
      type: Object as PropType<ImageDetail>,
      required: true,
    },
  },
  setup(props) {
    const { app } = useContext()
    const router = useRouter()
    const imgHeight = ref(props.image.height || 100)
    const imgWidth = ref(props.image.width || 100)

    const imageAspect = computed(() => imgWidth.value / imgHeight.value)

    const containerAspect = () => {
      if (imageAspect.value > maxAspect) return maxAspect
      if (imageAspect.value < minAspect) return minAspect
      return this.imageAspect
    }
    const iPadding = () => {
      if (imageAspect.value < minAspect) return (1 / minAspect) * 100
      if (imageAspect.value > maxAspect) return (1 / maxAspect) * 100
      return (1 / this.imageAspect) * 100
    }
    const imageWidth = () => {
      if (imageAspect.value < maxAspect) return 100
      return (imageAspect.value / maxAspect) * 100
    }
    const imageTop = () => {
      if (imageAspect.value > minAspect) return 0
      return (
        ((minAspect - this.imageAspect) /
          (imageAspect.value * minAspect * minAspect)) *
        -50
      )
    }
    const imageLeft = () => {
      if (imageAspect.value < maxAspect) return 0
      return ((imageAspect.value - maxAspect) / maxAspect) * -50
    }

    const getImageUrl = () => {
      const url = props.image.thumbnail || props.image.url
      if (imageAspect.value > panaromaAspect) return toAbsolutePath(url)
      return toAbsolutePath(url)
    }

    const getImageForeignUrl = () =>
      toAbsolutePath(props.image.foreign_landing_url)

    const onGotoDetailPage = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        const detailRoute = app.localeRoute({
          name: 'PhotoDetailPage',
          params: { id: props.image.id, location: window.scrollY },
        })
        router.push(detailRoute)
      }
    }
    const onImageLoadError = (event: Event) => {
      const element = event.target as HTMLImageElement
      if (element.src !== props.image.url) {
        element.src = props.image.url
      } else {
        element.src = errorImage
      }
    }
    const getImgDimension = (event: Event) => {
      const element = event.target as HTMLImageElement
      imgHeight.value = element.naturalHeight
      imgWidth.value = element.naturalWidth
    }

    return {
      widthBasis,
      imgHeight,
      imgWidth,
      imageAspect,
      containerAspect,
      iPadding,

      imageWidth,
      imageTop,
      imageLeft,

      getImageUrl,
      getImageForeignUrl,
      onGotoDetailPage,
      onImageLoadError,
      getImgDimension,
    }
  },
})
</script>
