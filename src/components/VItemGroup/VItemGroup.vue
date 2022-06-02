<template>
  <div
    ref="nodeRef"
    class="w-full flex"
    :role="type"
    :class="{
      'flex-col': direction === 'vertical',
      'flex-row': direction !== 'vertical',
      'flex-wrap': direction === 'columns',
    }"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
  >
    <!--
      @slot The items in the item group. Must include some `VItem`s but can
      include additional elements as-needed.
    -->
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  ref,
  readonly,
  InjectionKey,
  PropType,
  Ref,
} from '@nuxtjs/composition-api'
import { ensureFocus } from 'reakit-utils/ensureFocus'

import { useI18n } from '~/composables/use-i18n'

import { keycodes } from '~/constants/key-codes'

type VItemGroupContext = {
  direction: 'vertical' | 'horizontal' | 'columns'
  bordered: boolean
  type: 'menu' | 'radiogroup'
  size: 'small' | 'medium'
}

export const VItemGroupContextKey = Symbol(
  'VItemGroupContext'
) as InjectionKey<VItemGroupContext>

type VItemGroupFocusContext = {
  isGroupFocused: Readonly<Ref<boolean>>
  onItemKeyPress: (event: KeyboardEvent) => void
  selectedCount: Readonly<Ref<number>>
  setSelected: (selected: boolean, previousSelected: boolean) => void
}

export const VItemGroupFocusContextKey = Symbol(
  'VItemGroupFocusContext'
) as InjectionKey<VItemGroupFocusContext>

const arrows = [
  keycodes.ArrowUp,
  keycodes.ArrowDown,
  keycodes.ArrowLeft,
  keycodes.ArrowRight,
]

export default defineComponent({
  name: 'VItemGroup',
  props: {
    /**
     * The direction to render the items in.
     *
     * @default 'vertical'
     */
    direction: {
      type: String as PropType<VItemGroupContext['direction']>,
      default: 'vertical',
    },
    /**
     * Whether to render a bordered, separated list of items. When false each
     * item will have whitespace separating them instead of borders.
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
      type: String as PropType<VItemGroupContext['type']>,
      default: 'menu',
    },
    /**
     * Size of the item group corresponds to the size of the component.
     *
     * @default 'small'
     */
    size: {
      type: String as PropType<VItemGroupContext['size']>,
      default: 'small',
    },
  },
  setup(props) {
    /** @type {import('@nuxtjs/composition-api').Ref<HTMLElement | undefined>} */
    const nodeRef = ref()
    const isFocused = ref(false)
    provide(VItemGroupContextKey, props)

    const i18n = useI18n()

    /**
     * When the item group is horizontal, we need to "reverse" the behavior of the left and right arrow keys for RTL locales
     * because the DOM order gets reversed to be opposite the visual order relative to left/right movement.
     *
     * For vertical locales it should remain the same.
     * @param ltr
     * @param rtl
     */
    const resolveArrow = (ltr: string, rtl: string) => {
      return i18n.localeProperties.dir === 'rtl' &&
        props.direction === 'horizontal'
        ? rtl
        : ltr
    }

    const onItemKeyPress = (event: KeyboardEvent) => {
      if (!Array.from(arrows).includes(event.key) || !nodeRef.value) return

      event.preventDefault()

      const target = event.target

      // While VItem ultimately renders a button at the moment, that could change in the future, so using a data attribute selector makes it more flexible for the future
      const items = Array.from(
        nodeRef.value.querySelectorAll('[data-item-group-item]')
      ) as HTMLElement[]

      const targetIndex = items.findIndex((item) => item === target)

      switch (event.key) {
        case keycodes.ArrowUp:
        case resolveArrow(keycodes.ArrowLeft, keycodes.ArrowRight):
          if (targetIndex === 0) {
            return ensureFocus(items[items.length - 1])
          }
          return ensureFocus(items[targetIndex - 1])
        case keycodes.ArrowDown:
        case resolveArrow(keycodes.ArrowRight, keycodes.ArrowLeft):
          if (targetIndex === items.length - 1) {
            return ensureFocus(items[0])
          }
          return ensureFocus(items[targetIndex + 1])
      }
    }

    const selectedCount = ref(0)

    /**
     * @param {boolean} selected
     * @param {boolean} previousSelected
     */
    const setSelected = (selected, previousSelected) => {
      if (previousSelected && !selected) selectedCount.value -= 1
      if (!previousSelected && selected) selectedCount.value += 1
    }

    const focusContext = {
      isGroupFocused: readonly(isFocused),
      onItemKeyPress,
      selectedCount: readonly(selectedCount),
      setSelected,
    }

    provide(VItemGroupFocusContextKey, focusContext)

    return { isFocused, nodeRef }
  },
})
</script>
