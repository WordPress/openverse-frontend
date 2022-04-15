<template>
  <div>
    <Component
      :is="base"
      v-for="variation in variations"
      v-bind="{ ...$attrs, ...(variation.props || {}) }"
      :key="variation.key"
      v-on="{ ...$listeners, ...(variation.listeners || {}) }"
    >
      <slot />
    </Component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export interface Variation {
  key: string
  props?: Record<string, unknown>
  listeners?: Record<string, unknown>
}

/**
 * Allows rendering multiple variations of the same component
 * without having to duplicate shared props between them. Particularly
 * useful for rendering variations based on CSS breakpoints where
 * some props differ depending on what breakpoints each variation
 * is visible in.
 *
 * For example, to render a button that is only given a particular
 * variant in a specific breakpoint, you would render two buttons
 * where one is visible only within the target breakpoint and has
 * the prop applied, and the other is visible in the other breakpoints
 * and has a different prop applied.
 *
 * @example
 * ```vue
 * <template>
 *  <VVariations
 *    base="VButton"
 *    @click="handleClickForAllVariations"
 *    :variations="[
 *      {
 *        key: 'desktop',
 *        props: { class: 'hidden md:block', variant: 'primary' },
 *      },
 *      {
 *        key: 'mobile',
 *        props: { class: 'md:hidden', variant: 'secondary' },
 *      },
 *    ]"
 * </template>
 * ```
 *
 * Primarily this is used to help avoid using JavaScript to detect
 * a breakpoint and modify a prop value to prevent SSR hydration
 * jumps when the JavaScript media query is updated to match the
 * client (where it can be different from the server).
 */
export default defineComponent({
  name: 'VVariations',
  inheritAttrs: false,
  props: {
    base: {
      type: String,
      required: true,
    },
    variations: {
      type: Array as PropType<readonly Variation[]>,
      required: true,
    },
  },
})
</script>
