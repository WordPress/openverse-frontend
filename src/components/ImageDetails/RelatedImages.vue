<template>
  <aside
    :aria-label="$t('photo-details.aria.related')"
    class="p-4 my-6 photo_related-images"
  >
    <h3 class="b-header">
      {{ $t('photo-details.related-images') }}
    </h3>
    <ImageGrid
      :images="images"
      :can-load-more="false"
      :is-fetching="$fetchState.pending"
      :fetching-error="$fetchState.error"
      :error-message-text="null"
    />
  </aside>
</template>

<script>
import { defineComponent } from '#app'
import { IMAGE } from '~/constants/media'
import ImageGrid from '~/components/ImageGrid/ImageGrid'
import { fetchRelated } from '~/data/fetch-related'

export default defineComponent({
  name: 'RelatedImages',
  components: { ImageGrid },
  props: {
    imageId: {
      type: String,
      required: true,
    },
    service: {},
  },
  data() {
    return { images: [] }
  },
  fetch() {
    fetchRelated(this, 'images', {
      mediaType: IMAGE,
      mediaId: this.$props.imageId,
    })
  },
})
</script>
