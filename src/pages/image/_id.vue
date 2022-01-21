<template>
  <div>
    <a
      v-if="shouldShowBreadcrumb"
      class="px-6 py-4 flex flex-row items-center bg-dark-charcoal-06 font-semibold text-xs md:text-sr"
      :href="breadcrumbUrl"
      @click.prevent="$router.back()"
    >
      <Chevron class="-ml-2" />
      {{ $t('image-details.back') }}
    </a>

    <figure class="w-full mb-4 px-6 bg-dark-charcoal-06">
      <img
        :src="image.url"
        :alt="image.title"
        class="max-h-screen md:mx-auto"
        @load="onImageLoaded"
      />
      <!-- TODO: Add SketchFabViewer -->
    </figure>

    <section
      class="flex flex-row flex-wrap justify-between md:flex-row-reverse"
    >
      <VButton
        as="a"
        class="btn-main w-full mb-4 md:w-auto md:mb-0 font-bold"
        :href="image.foreign_landing_url"
        target="blank"
        rel="noopener noreferrer"
        >{{ $t('image-details.weblink') }}</VButton
      >
      <span>
        <h1 class="text-base md:text-3xl">
          {{ image.title }}
        </h1>
        <i18n
          v-if="image.creator"
          path="image-details.creator"
          tag="span"
          class="font-bold"
        >
          <template #name>
            <a
              v-if="image.creator_url"
              :aria-label="
                $t('photo-details.aria.creator-url', {
                  creator: image.creator,
                })
              "
              :href="image.creator_url"
              target="blank"
              rel="noopener noreferrer"
              class="text-pink"
            >
              <!-- TODO: keep handling source link clicked event? -->
              {{ image.creator }}
            </a>
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
    <!-- <VRelatedImages /> -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import { FETCH_IMAGE } from '~/constants/action-types'
import { MEDIA } from '~/constants/store-modules'
import MediaReuse from '~/components/MediaInfo/VMediaReuse.vue'
import VImageDetails from '~/components/VImageDetails/VImageDetails.vue'
// import VRelatedImages from '~/components/VImageDetails/VRelatedImages.vue'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

import Chevron from '~/assets/icons/chevron-left.svg?inline'

const VImageDetailsPage = {
  name: 'VImageDetailsPage',
  components: { MediaReuse, Chevron, VButton, VIcon, VImageDetails },
  // layout: 'blank',
  data() {
    return {
      breadcrumbUrl: '',
      shouldShowBreadcrumb: false,
      imageWidth: 0,
      imageHeight: 0,
      imageType: 'Unknown',
      thumbnailURL: '',
      imageId: null,
    }
  },
  computed: {
    ...mapState(MEDIA, ['image']),
  },
  async asyncData({ route }) {
    return {
      imageId: route.params.id,
    }
  },
  async fetch() {
    try {
      await this.fetchImage({ id: this.imageId })
    } catch (err) {
      const errorMessage = this.$t('error.image-not-found', {
        id: this.imageId,
      })
      this.$nuxt.error({
        statusCode: 404,
        message: errorMessage,
      })
    }
  },
  beforeRouteEnter(to, from, nextPage) {
    nextPage((_this) => {
      if (from.path === '/search/' || from.path === '/search/image') {
        _this.shouldShowBreadcrumb = true
        _this.breadcrumbUrl = from.fullPath
      }
    })
  },
  methods: {
    ...mapActions(MEDIA, { fetchImage: FETCH_IMAGE }),
    onImageLoaded(event) {
      this.imageWidth = this.image.width || event.target.naturalWidth
      this.imageHeight = this.image.height || event.target.naturalHeight
      if (this.image.filetype) {
        this.imageType = this.image.filetype
      } else {
        axios.head(event.target.src).then((res) => {
          this.imageType = res.headers['content-type']
        })
      }
    },
  },
  head() {
    const title = this.image.title
    return {
      title: `${title} - ${this.$t('hero.brand')}`,
    }
  },
}

export default VImageDetailsPage
</script>

<style scoped>
section,
aside {
  @apply px-6 mb-10 md:px-16 md:my-16 md:max-w-screen-lg lg:mx-auto;
}
</style>
