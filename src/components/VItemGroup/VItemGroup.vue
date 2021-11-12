<template>
  <div class="w-full" role="list" :class="$style[direction]">
    <!--
      @slot The items in the item group. Should all be `VItem`s
    -->
    <slot name="default" />
  </div>
</template>

<script>
import { defineComponent, provide } from '@nuxtjs/composition-api'

export const VItemGroupContextKey = Symbol('VItemGroupContext')

export default defineComponent({
  name: 'VItemGroup',
  props: {
    direction: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<'vertical' | 'horizontal'>} */ (String),
      default: 'vertical',
      validate: (v) => ['vertical', 'horizontal'].includes(v),
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    provide(VItemGroupContextKey, props)
  },
})
</script>

<style module>
.horizontal {
  @apply flex flex-row;
}

.vertical {
  @apply flex flex-col;
}
</style>
