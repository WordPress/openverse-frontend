<template>
  <div
    class="w-full flex"
    :role="type"
    :class="direction === 'vertical' ? 'flex-col' : 'flex-row'"
  >
    <!--
      @slot The items in the item group. Should all be `VItem`s
    -->
    <slot name="default" />
  </div>
</template>

<script>
import { defineComponent, provide } from '@nuxtjs/composition-api'

/**
 * @typedef VItemGroupContext
 * @property {'vertical' | 'horizontal'} direction
 * @property {boolean} bordered
 * @property {'menu' | 'radiogroup'} type
 */

/**
 * @type {import('@nuxtjs/composition-api').InjectionKey<VItemGroupContext>}
 */
export const VItemGroupContextKey = Symbol('VItemGroupContext')

export default defineComponent({
  name: 'VItemGroup',
  props: {
    /**
     * The direction to render the items in.
     *
     * @default 'vertical'
     */
    direction: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<'vertical' | 'horizontal'>} */ (String),
      default: 'vertical',
      validate: (v) => ['vertical', 'horizontal'].includes(v),
    },
    /**
     * Whether to render a bordered, separated list of items. When false each
     * item will be have whitespace separating them instead of borders.
     *
     * @default true
     */
    bordered: {
      type: Boolean,
      default: true,
    },
    /**
     * The type of item group and item to render. This directly affects the `role` attribute
     * of the container and the items themselves.
     *
     * `menu` should be used when providing a menu of independent options.
     *
     * @see https://www.w3.org/TR/wai-aria-1.1/#menu
     *
     * `radiogroup` should be used when providing a menu of options where only one can be selected at a time.
     *
     * @see https://www.w3.org/TR/wai-aria-1.1/#radiogroup
     *
     * @default 'menu'
     */
    type: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<'menu' | 'radiogroup'>} */ (String),
      default: 'menu',
      validate: (v) => ['menu', 'radiogroup'].includes(v),
    },
  },
  setup(props) {
    provide(VItemGroupContextKey, props)
  },
})
</script>
