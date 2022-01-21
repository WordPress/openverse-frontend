<template>
  <VItem
    :selected="selected"
    :is-first="itemId === 0"
    @click.native="$emit('click', item)"
  >
    <VIcon :icon-path="icon" class="me-2 ms-0 my-4" />
    <span class="pe-20 py-4 font-semibold">{{
      $t(`search-type.${item}`)
    }}</span>
  </VItem>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
/** @typedef {import('@nuxtjs/composition-api').ExtractPropTypes<typeof propTypes>} Props */
const propTypes = {
  item: { type: String, required: true },
  itemId: { type: Number, required: true },
  selected: { type: Boolean, default: false },
  icon: { type: String, required: true },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['medium', 'small'].includes(val),
  },
}
const VContentItem = defineComponent({
  name: 'VContentItem',
  props: propTypes,
})
export default VContentItem
</script>

<style scoped></style>
