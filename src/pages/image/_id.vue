<template>
  <VImageResult :image-id="imageId" :bread-crumb-u-r-l="breadCrumbURL" />
</template>

<script>
import VImageResult from '~/components/VImageResult.vue'

const PhotoDetailPage = {
  name: 'PhotoDetailPage',
  components: { VImageResult },
  layout: 'with-nav-search',
  data() {
    return {
      breadCrumbURL: '',
      imageId: null,
    }
  },
  async asyncData({ route }) {
    return {
      imageId: route.params.id,
    }
  },
  beforeRouteEnter(to, from, nextPage) {
    nextPage((_this) => {
      if (from.path === '/search/' || from.path === '/search/image') {
        _this.breadCrumbURL = from.fullPath
      }
    })
  },
}

export default PhotoDetailPage
</script>
