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
      :is-fetching="isFetching"
      :fetching-error="fetchingError"
      :error-message-text="null"
    />
  </aside>
</template>

<script>
import ImageService from '~/data/image-service'

export default {
  name: 'RelatedImages',
  props: {
    imageId: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    images: [],
    service: ImageService,
  }),
  fetch() {
    const mainImageId = this.$props.imageId
      ? this.$props.imageId
      : this.$route.params.id
    this.service
      .getRelatedMedia({ id: mainImageId })
      .then(({ data }) => {
        this.images = data.results
      })
      .catch((err) => {
        console.log('Error', err)
      })
  },
  computed: {
    isFetching() {
      return !this.$fetchState.pending
    },
    fetchingError() {
      return this.$fetchState.error
    },
  },
}
</script>
