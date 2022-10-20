<template>
  <svg
    class="v-icon flex-shrink-0 flex-grow-0"
    :class="{ 'rtl-flip': rtlFlip }"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    aria-hidden="true"
    focusable="false"
  >
    <use :href="`${iconPath}#${gId}`" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { isTest } from '~/utils/node-env'

export type IconPath = string
export type IconProps = {
  iconPath: IconPath
  viewBox?: string
  gId?: string
  size?: number
  rtlFlip?: boolean
}

/**
 * Displays the given icon in a 24px × 24px square.
 */
export default defineComponent({
  name: 'VIcon',
  props: {
    /**
     *
     */
    viewBox: {
      type: String,
      default: '0 0 24 24',
    },
    /**
     * the path to the icon SVG; In a bundled application like Openverse,
     * importing an SVG should give us the path to the file.
     */
    iconPath: {
      /**
       * In `jest` our icons get transformed to Vue components
       */
      type: isTest ? Object : String,
      required: true,
    },
    /**
     * the ID of the `g` element to import from the icon; This element should
     * ideally have the `id` as "icon" and the `fill` as `currentColor`.
     */
    gId: {
      type: String,
      default: 'icon',
    },
    /**
     * whether to flip the icon for RTL languages; This generally makes sense
     * for directional icons such as those involving arrows.
     */
    rtlFlip: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
[dir='rtl'] .v-icon.rtl-flip {
  @apply -scale-x-100 transform;
}
</style>
