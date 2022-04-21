<template>
  <div>
    <figure class="w-full mb-4 pt-8 md:pt-12 px-6 bg-dark-charcoal-06 relative">
      <img
        v-if="!sketchFabUid"
        id="main-image"
        :src="isLoadingFullImage ? image.thumbnail : image.url"
        :alt="image.title"
        class="h-full max-h-[500px] mx-auto rounded-t-sm"
        @load="onImageLoaded"
      />
      <SketchFabViewer
        v-else
        :uid="sketchFabUid"
        class="mx-auto rounded-t-sm"
        @failure="sketchFabFailure = true"
      />
    </figure>

    <section
      id="title-button"
      class="flex flex-row md:flex-row-reverse flex-wrap justify-between md:mt-6"
    >
      <VButton
        as="VLink"
        :href="image.foreign_landing_url"
        class="btn-main flex-initial w-full md:w-max mb-4 md:mb-0"
        size="large"
        >{{ $t('image-details.weblink') }}</VButton
      >
      <span class="flex-1 flex flex-col justify-center">
        <h1 class="text-base md:text-3xl font-semibold leading-[130%]">
          {{ image.title }}
        </h1>
        <i18n
          v-if="image.creator"
          path="image-details.creator"
          tag="span"
          class="font-semibold leading-[130%]"
        >
          <template #name>
            <VLink
              v-if="image.creator_url"
              :aria-label="
                $t('media-details.aria.creator-url', {
                  creator: image.creator,
                })
              "
              :href="image.creator_url"
              >{{ image.creator }}</VLink
            >
            <span v-else>{{ image.creator }}</span>
          </template>
        </i18n>
      </span>
    </section>

    <VMediaReuse :media="image" />
    <VImageDetails
      :image="image"
      :image-width="imageWidth"
      :image-height="imageHeight"
      :image-type="imageType"
    />
    <VRelatedImages :media="relatedMedia" :fetch-state="relatedFetchState" />
  </div>
</template>

<script>
import { ref, defineComponent, computed } from '@nuxtjs/composition-api'
import axios from 'axios'

import { useSingleResultStore } from '~/stores/media/single-result'
import { useRelatedMediaStore } from '~/stores/media/related-media'

import VButton from '~/components/VButton.vue'
import VLink from '~/components/VLink.vue'
import VImageDetails from '~/components/VImageDetails/VImageDetails.vue'
import VMediaReuse from '~/components/VMediaInfo/VMediaReuse.vue'
import VRelatedImages from '~/components/VImageDetails/VRelatedImages.vue'
import SketchFabViewer from '~/components/SketchFabViewer.vue'

export default defineComponent({
  name: 'VImageResult',
  components: {
    VButton,
    VLink,
    VImageDetails,
    VMediaReuse,
    VRelatedImages,
    SketchFabViewer,
  },
  setup() {
    const singleResultStore = useSingleResultStore()
    const image = computed(() => singleResultStore.mediaItem)
    const imageWidth = ref(image.width)
    const imageHeight = ref(image.height)
    const imageType = ref(image.filetype)
    const isLoadingFullImage = ref(true)
    const sketchFabFailure = ref(false)
    const sketchFabUid = computed(() => {
      if (image?.source !== 'sketchfab' || sketchFabFailure.value) {
        return null
      }
      return image.url
        .split('https://media.sketchfab.com/models/')[1]
        .split('/')[0]
    })

    const onImageLoaded = (event) => {
      imageWidth.value = image.width || event.target.naturalWidth
      imageHeight.value = image.height || event.target.naturalHeight
      if (image.filetype) {
        isLoadingFullImage.value = false
      } else {
        axios
          .head(event.target.src)
          .then((res) => {
            imageType.value = res.headers['content-type']
            isLoadingFullImage.value = false
          })
          .catch(() => {
            /**
             * Do nothing. This avoid the console warning "Uncaught (in promise) Error:
             * Network Error" in Firefox in development mode.
             */
          })
      }
    }

    const relatedMediaStore = useRelatedMediaStore()

    const relatedMedia = computed(() => relatedMediaStore.media)
    const relatedFetchState = computed(() => relatedMediaStore.fetchState)

    return {
      image,
      onImageLoaded,
      sketchFabUid,
      sketchFabFailure,
      relatedMedia,
      relatedFetchState,

      isLoadingFullImage,
      imageWidth,
      imageHeight,
      imageType,
    }
  },
})
</script>
