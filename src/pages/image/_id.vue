<template>
  <VImageResult />
</template>

<script>
import { IMAGE } from '~/constants/media'
import { useSingleResultStore } from '~/stores/media/single-result'

import VImageResult from '~/components/VImageResult.vue'

const VImageDetailsPage = {
  name: 'VImageDetailsPage',
  components: {
    VImageResult,
  },
  async asyncData({ app, error, route, $pinia }) {
    const imageId = route.params.id
    const singleResultStore = useSingleResultStore($pinia)
    try {
      await singleResultStore.fetchMediaItem(IMAGE, imageId)
      const image = singleResultStore.mediaItem
      return {
        image,
      }
    } catch (err) {
      const errorMessage = app.i18n.t('error.image-not-found', {
        id: imageId,
      })
      error({
        statusCode: 404,
        message: errorMessage,
      })
    }
  },
  head() {
    const title = `${this.image.title} | Openverse`

    return {
      title,
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.image.url,
        },
      ],
    }
  },
}

export default VImageDetailsPage
</script>

<style scoped>
section,
aside {
  @apply px-6 md:px-16 mb-10 md:mb-16 md:max-w-screen-lg lg:mx-auto;
}

.btn-main {
  @apply py-3 md:py-4 md:px-6 text-sr md:text-2xl font-semibold;
}
</style>
