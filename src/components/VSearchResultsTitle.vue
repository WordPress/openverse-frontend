<template>
  <h1
    class="leading-tight sr-only md:not-sr-only break-words"
    :class="[size === 'large' ? 'text-[90px]' : 'text-6xl']"
  >
    <slot default />
  </h1>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

type TitleSize = 'default' | 'large'

export default defineComponent({
  name: 'VSearchResultsTitle',
  props: {
    size: {
      required: false,
      default: 'default',
      type: String as PropType<TitleSize>,
    },
  },
})
</script>

<style scoped>
/* Title case the user's search query */
h1:first-letter {
  text-transform: uppercase;
}
</style>
