<template>
  <aside
    :aria-label="$t('photo-details.aria.related')"
    class="m-6 md:mx-14 md:mb-14 photo_related-images"
  >
    <h3 class="text-3xl">
      {{ $t('photo-details.related-images') }}
    </h3>
    <VImageGrid
      :images="images"
      :can-load-more="false"
      :fetch-state="{
        isFetching: $fetchState.pending,
        fetchingError: $fetchState.error,
      }"
      :columns="3"
    />
  </aside>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import useRelated from '~/composables/use-related'
import { IMAGE } from '~/constants/media'
import VImageGrid from '~/components/VImageGrid/VImageGrid'

export default {
  name: 'RelatedImages',
  components: { VImageGrid },
  props: {
    imageId: {
      type: String,
      required: true,
    },
    service: {},
  },
  /**
   * Fetches related images on `imageId` change
   * @param {object} props
   * @param {string} props.imageId
   * @param {any} props.service
   * @return {{ images: Ref<ImageDetail[]> }}
   */
  setup(props) {
    const mainImageId = ref(props.imageId)
    const relatedOptions = {
      mediaType: IMAGE,
      mediaId: mainImageId,
    }
    // Using service prop to be able to mock when testing
    if (props.service) {
      relatedOptions.service = props.service
    }
    const { media: images } = useRelated(relatedOptions)

    return { images }
  },
}
</script>
