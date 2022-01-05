<template>
  <h1
    class="capitalize leading-tight"
    :class="{ 'text-[90px]': size === 'large' }"
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
