<template>
  <aside>
    <h3 class="text-2xl md:text-3xl mb-6">
      {{ $t('image-details.related-images') }}
    </h3>
    <GridSkeleton v-if="!imageId" is-for-tab="image" :nums-elems="10" />
    <!-- TODO: use a image grid with correct margins and items gaps -->
    <!-- <ImageGrid
      v-if="imageId"
      :images="images"
      :can-load-more="false"
      :fetch-state="{
        isFetching: $fetchState.pending,
        fetchingError: $fetchState.error,
      }"
    /> -->
  </aside>
</template>

<script>
export default {
  name: 'VRelatedImages',
  // components: { ImageGrid },
  props: {
    imageId: {
      type: String,
    },
  },
}
</script>
