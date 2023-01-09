<template>
  <div class="grid grid-cols-2">
    <img
      id="main-image"
      :src="imageSrc"
      :alt="image.title"
      class="mx-auto h-full max-h-[500px] w-full rounded-t-sm object-contain"
      :width="imageWidth"
      :height="imageHeight"
    />
    <VContentReportForm
      :close-fn="() => {}"
      :media="image"
      :provider-name="image.providerName"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@nuxtjs/composition-api"

import { IMAGE } from "~/constants/media"

import { useSingleResultStore } from "~/stores/media/single-result"
import type { ImageDetail } from "~/types/media"

export default defineComponent({
  name: "ReportImage",
  setup() {
    const singleResultStore = useSingleResultStore()
    const image = computed(() =>
      singleResultStore.mediaType === IMAGE
        ? (singleResultStore.mediaItem as ImageDetail)
        : null
    )
    const imageWidth = ref(0)
    const imageHeight = ref(0)
    const imageType = ref("Unknown")
    /**
     * To make sure that image is loaded fast, we `src` to `image.thumbnail`,
     * and then replace it with the provider image once it is loaded.
     */
    const imageSrc = ref(image.value.thumbnail)

    return {
      image,
      imageWidth,
      imageHeight,
      imageType,
      imageSrc,
    }
  },
  async asyncData({ app, error, route, $pinia }) {
    const imageId = route.params.id
    const singleResultStore = useSingleResultStore($pinia)
    try {
      await singleResultStore.fetch(IMAGE, imageId)
    } catch (err) {
      const errorMessage = app.i18n
        .t("error.image-not-found", {
          id: imageId,
        })
        .toString()
      return error({
        statusCode: 404,
        message: errorMessage,
      })
    }
  },
})
</script>
