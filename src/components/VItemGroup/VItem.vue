<template>
  <VButton
    class="flex justify-between w-full"
    :class="{ [$style.item]: true }"
    variant="grouped"
    :pressed="selected"
    v-bind="$attrs"
    role="listitem"
    v-on="$listeners"
  >
    <div class="flex flex-row">
      <slot name="default" />
    </div>
    <VIcon v-if="selected" :icon-path="check" />
  </VButton>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import check from '~/assets/icons/check.svg'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

export default defineComponent({
  name: 'VItem',
  components: { VButton, VIcon },
  props: {
    selected: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return { check }
  },
})
</script>

<style module>
.item {
  @apply min-w-full rounded-none border border-t-0 border-b border-dark-charcoal-20 justify-between;
}

.item:first-of-type {
  @apply rounded-t-sm border-t;
}

.item:last-of-type {
  @apply rounded-b-sm;
}
</style>
