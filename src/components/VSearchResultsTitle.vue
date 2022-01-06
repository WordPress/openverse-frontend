<template>
  <h1
    class="capitalize leading-tight sr-only md:not-sr-only"
    :class="[size === 'large' ? 'text-[90px]' : 'text-6xl']"
  >
    <slot default />
  </h1>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
const sizes = {
  DEFAULT: 'default',
  LARGE: 'large',
}
const VSearchResultsTitle = defineComponent({
  name: 'VSearchResultsTitle',
  props: {
    size: {
      required: false,
      default: sizes.DEFAULT,
      validator: (value) => Object.values(sizes).includes(value),
    },
  },
})
export default VSearchResultsTitle
</script>
