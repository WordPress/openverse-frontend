<template>
  <div
    :class="{
      [`flex p-2 ${$style[contextProps.direction]}`]: true,
      [`border border-dark-charcoal-20 ${
        $style[`${contextProps.direction}-bordered`]
      }`]: contextProps.bordered,
      'bg-dark-charcoal-10': selected && contextProps.bordered,
    }"
  >
    <VButton
      class="flex justify-between focus-visible:ring-pink rounded min-w-full"
      :class="$style[`${contextProps.direction}-button`]"
      variant="grouped"
      :pressed="selected"
      v-bind="$attrs"
      role="listitem"
      v-on="$listeners"
    >
      <div
        :class="[
          'flex-grow whitespace-nowrap',
          $style[`${contextProps.direction}-content`],
        ]"
      >
        <slot name="default" />
      </div>
      <VIcon
        v-if="selected && contextProps.direction === 'vertical'"
        :icon-path="check"
      />
    </VButton>
  </div>
</template>

<script>
import { defineComponent, inject } from '@nuxtjs/composition-api'
import check from '~/assets/icons/check.svg'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import { VItemGroupContextKey } from './VItemGroup.vue'

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
    const contextProps = inject(VItemGroupContextKey)
    return { check, contextProps }
  },
})
</script>

<style module>
.vertical {
  @apply min-w-full;
}

.vertical-bordered {
  @apply border-t-0 border-b;
}

.vertical:first-of-type {
  @apply rounded-t-sm;
}

.vertical-bordered:first-of-type {
  @apply border-t;
}

.vertical:last-of-type {
  @apply rounded-b-sm;
}

.vertical-content {
  @apply flex flex-row;
}

.horizontal-button {
  @apply w-max;
}

.horizontal-bordered {
  @apply border-s-0 border-e border-dark-charcoal-20;
}

.horizontal:first-of-type {
  @apply rounded-s-sm;
}

.horizontal-bordered:first-of-type {
  @apply border-s;
}

.horizontal:last-of-type {
  @apply rounded-e-sm;
}

.horizontal-content {
  @apply flex flex-col items-center;
}
</style>
