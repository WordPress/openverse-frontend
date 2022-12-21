<template>
  <!-- Wrapper element to center the grid if space is more than 5 columns. -->
  <div ref="el" class="mx-10 flex flex-row items-center justify-end me-12">
    <!-- Image grid only occupies as much width as needed. -->
    <div
      class="home-gallery inline-grid grid-flow-col grid-rows-3 gap-8"
      :style="{
        gap: `${space}px`,
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }"
    >
      <ClientOnly>
        <Component
          :is="prefersReducedMotion ? 'div' : 'Transition'"
          v-for="(image, idx) in imageList"
          :key="idx"
          name="fade"
          mode="out-in"
          appear
        >
          <VLink
            class="home-cell"
            :class="idx >= imageCount ? 'hidden' : 'block'"
            :style="{ '--transition-delay': `${idx * 0.05}s` }"
            :href="image.url"
          >
            <img
              :height="dimens"
              :width="dimens"
              :src="image.src"
              :alt="image.title"
              :title="image.title"
            />
          </VLink>
        </Component>
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useRouter,
  PropType,
  ref,
} from "@nuxtjs/composition-api"

import { useReducedMotion } from "~/composables/use-media-query"
import useResizeObserver from "~/composables/use-resize-observer"

import imageInfo from "~/assets/homepage_images/image_info.json"

export const GALLERY_SETS = [
  "universe",
  "pottery",
  "olympics",
  "random",
] as const
export type GallerySet = typeof GALLERY_SETS[number]

/**
 * Displays a grid of images for the homepage, with each image linking to its
 * single result page. The number of columns automatically adjusts to the width
 * of the container upto a max of 5.
 */
export default defineComponent({
  name: "VHomeGallery",
  props: {
    /**
     * the set of images to use for the gallery grid
     */
    set: {
      type: String as PropType<GallerySet>,
      required: false,
      default: "random",
      validator: (val: GallerySet) => GALLERY_SETS.includes(val),
    },
  },
  setup(props) {
    const { app } = useContext()
    const router = useRouter()
    const prefersReducedMotion = useReducedMotion()

    const dimens = 152 // px
    const space = 32 // px

    const rowCount = 3
    const columnCount = computed(() => {
      console.log(gridDimens.value.width)
      return Math.min(
        5, // Grid cannot exceed 5 columns as we only have 15 images.
        Math.floor((gridDimens.value.width + space) / (dimens + space))
      )
    })

    const el = ref<HTMLElement | null>(null) // template ref
    const { dimens: gridDimens } = useResizeObserver(el)

    const imageList = computed(() => {
      const imageSet =
        props.set === "random"
          ? imageInfo.sets[Math.floor(Math.random() * imageInfo.sets.length)]
          : imageInfo.sets.find((item) => (item.key = props.set))
      return imageSet?.images.map((image, idx) => ({
        ...image,
        src: require(`~/assets/homepage_images/${imageSet.key}/${idx + 1}.png`),
        url: router.resolve(
          app.localePath({
            name: "image-id",
            params: { id: image.identifier },
          })
        ).href,
      }))
    })
    const imageCount = computed(() => columnCount.value * rowCount)

    return {
      el,

      dimens,
      space,

      imageCount,
      columnCount,
      imageList,

      prefersReducedMotion,
    }
  },
})
</script>

<style>
.home-cell {
  transition-delay: var(--transition-delay) !important;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.5s;
}
</style>
