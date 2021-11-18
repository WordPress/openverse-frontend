<template>
  <div
    class="flex"
    :class="{
      [$style[contextProps.direction]]: true,
      [`border border-dark-charcoal-20 ${
        $style[`${contextProps.direction}-bordered`]
      }`]: contextProps.bordered,
      'bg-dark-charcoal-10': selected && contextProps.bordered,
      'p-2': isInPopover,
      [$style[`${contextProps.direction}-popover-item`]]: isInPopover,
    }"
  >
    <VButton
      class="flex justify-between focus-visible:ring-pink rounded min-w-full"
      :class="{
        [$style[`${contextProps.direction}-button`]]: true,
      }"
      variant="grouped"
      size="small"
      :pressed="selected"
      :role="contextProps.type === 'radiogroup' ? 'radio' : 'menuitemcheckbox'"
      :aria-checked="selected"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div
        class="flex-grow whitespace-nowrap"
        :class="$style[`${contextProps.direction}-content`]"
      >
        <slot name="default" />
      </div>
      <VIcon
        v-if="!isInPopover && selected && contextProps.direction === 'vertical'"
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
import { VPopoverContentContextKey } from '~/components/VPopover/VPopoverContent.vue'
import { warn } from '~/utils/warn'

export default defineComponent({
  name: 'VItem',
  components: { VButton, VIcon },
  props: {
    /**
     * Whether the item is selected/checked.
     */
    selected: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const isInPopover = inject(VPopoverContentContextKey, false)
    const contextProps = inject(VItemGroupContextKey)

    if (isInPopover && contextProps.bordered) {
      warn('Bordered popover items are not supported')
    }

    return { check, contextProps, isInPopover }
  },
})
</script>

<style module>
.vertical {
  @apply min-w-max;
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

.vertical-popover-item {
  @apply pb-0;
}

.vertical-popover-item:last-of-type {
  @apply pb-2;
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

.horizontal-popover-item {
  @apply pe-0;
}

.horizontal-popover-item:last-of-type {
  @apply pe-2;
}
</style>
