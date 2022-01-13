<template>
  <div>
    <VPhotoDetails
      :image="image"
      :thumbnail="thumbnailURL"
      :bread-crumb-u-r-l="breadCrumbURL"
      :should-show-breadcrumb="breadCrumbURL !== ''"
      :image-width="imageWidth"
      :image-height="imageHeight"
      :image-type="imageType"
      @onImageLoaded="onImageLoaded"
    />
    <RelatedImages :image-id="imageId" />
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from '@nuxtjs/composition-api'
import { mapActions, mapState } from 'vuex'
import { FETCH_IMAGE } from '~/constants/action-types'
import { MEDIA } from '~/constants/store-modules'
import RelatedImages from '~/components/ImageDetails/RelatedImages.vue'
import VPhotoDetails from '~/components/ImageDetails/VPhotoDetails.vue'

console.log('foobar')

const VImageResult = defineComponent({
  name: 'VImageResult',
  components: { RelatedImages, VPhotoDetails },
  props: {
    imageId: {
      type: String,
      default: null,
    },
    breadCrumbURL: {
      type: String,
      default: '',
    },
  },
  async asyncData({ env, route }) {
    const id = this.resolvedImageId || route.params.id
    return {
      thumbnailURL: `${env.apiUrl}images/${id}/thumb/`,
      resolvedImageId: id,
    }
  },
  data() {
    return {
      isPrimaryImageLoaded: false,
      imageWidth: 0,
      imageHeight: 0,
      imageType: 'Unknown',
      thumbnailURL: '',
      resolvedImageId: this.imageId,
    }
  },
  async fetch() {
    try {
      await this.fetchImage({ id: this.resolvedImageId })
    } catch (err) {
      const errorMessage = this.$t('error.image-not-found', {
        id: this.resolvedImageId,
      })
      this.$nuxt.error({
        statusCode: 404,
        message: errorMessage,
      })
    }
  },
  computed: {
    ...mapState(MEDIA, ['image']),
  },
  methods: {
    ...mapActions(MEDIA, { fetchImage: FETCH_IMAGE }),
    onImageLoaded(event) {
      this.imageWidth = event.target.naturalWidth
      this.imageHeight = event.target.naturalHeight
      this.isPrimaryImageLoaded = true
      axios.head(event.target.src).then((res) => {
        this.imageType = res.headers['content-type']
      })
    },
  },
})

export default VImageResult
</script>
