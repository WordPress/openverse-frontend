<template>
  <div
    class="mx-auto mt-4 mb-6 max-w-none gap-x-10 px-6 md:grid md:max-w-4xl md:grid-cols-2 lg:mb-30 lg:px-0 xl:max-w-5xl"
  >
    <div class="col-span-2">
      <VBackToSearchResultsLink
        text="Go to single result"
        :href="`/image/${image.id}`"
      />
    </div>

    <figure class="mb-6">
      <img
        id="main-image"
        :src="imageSrc"
        :alt="image.title"
        class="mx-auto h-auto w-full"
        :width="imageWidth"
        :height="imageHeight"
      />
      <!-- Disable reason: We control the attribution HTML generation so this is safe and will not lead to XSS attacks -->
      <!-- eslint-disable vue/no-v-html -->
      <caption
        class="block w-full"
        v-html="getAttributionMarkup({ includeIcons: false })"
      />
      <!-- eslint-enable vue/no-v-html -->
    </figure>

    <VContentReportForm
      :close-fn="() => {}"
      :media="image"
      :allow-cancel="false"
      :provider-name="image.providerName"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@nuxtjs/composition-api"

import { useI18n } from "~/composables/use-i18n"

import { IMAGE } from "~/constants/media"

import { useSingleResultStore } from "~/stores/media/single-result"
import type { ImageDetail } from "~/types/media"
import { AttributionOptions, getAttribution } from "~/utils/attribution-html"

export default defineComponent({
  name: "ReportImage",
  setup() {
    const i18n = useI18n()
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

    const getAttributionMarkup = (options?: AttributionOptions) =>
      getAttribution(image.value, i18n, options)

    return {
      image,
      imageWidth,
      imageHeight,
      imageType,
      imageSrc,
      getAttributionMarkup,
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
