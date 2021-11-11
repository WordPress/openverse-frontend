<template>
  <VButton
    class="flex justify-between w-full"
    :class="$style[direction]"
    variant="grouped"
    :pressed="selected"
    v-bind="$attrs"
    role="listitem"
    v-on="$listeners"
  >
    <div :class="$style[`${direction}-content`]">
      <slot name="default" />
    </div>
    <VIcon v-if="selected && direction === 'vertical'" :icon-path="check" />
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
    direction: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<'vertical' | 'horizontal'>} */ (String),
      default: 'vertical',
      validate: (v) => ['vertical', 'horizontal'].includes(v),
    },
  },
  setup() {
    return { check }
  },
})
</script>

<style module>
.vertical {
  @apply min-w-full rounded-none border border-t-0 border-b border-dark-charcoal-20 justify-between;
}

.vertical:first-of-type {
  @apply rounded-t-sm border-t;
}

.vertical:last-of-type {
  @apply rounded-b-sm;
}

.vertical-content {
  @apply flex flex-row;
}

.horizontal {
  @apply rounded-none border border-s-0 border-e border-dark-charcoal-20;
}

.horizontal:first-of-type {
  @apply rounded-s-sm border-s;
}

.horizontal:last-of-type {
  @apply rounded-e-sm;
}

.horizontal-content {
  @apply flex flex-col items-center;
}
</style>
