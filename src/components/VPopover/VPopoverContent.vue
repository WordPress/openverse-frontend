<template>
  <div
    v-show="visible"
    class="h-0 w-0"
    :aria-hidden="!visible"
    v-on="$listeners"
    @keydown="onKeyDown"
  >
    <div
      ref="popoverRef"
      class="max-w-max rounded-sm border border-light-gray bg-white shadow"
      :style="{ zIndex }"
      :tabindex="-1"
      @blur="onBlur"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, ref, provide } from '@nuxtjs/composition-api'

import { placements as popoverPlacements } from '@popperjs/core'

import { usePopoverContent } from '~/composables/use-popover-content'
import { warn } from '~/utils/console'

/**
 * @type {import('@nuxtjs/composition-api').InjectionKey<boolean>}
 */
export const VPopoverContentContextKey = Symbol('VPopoverContentContextKey')

export default defineComponent({
  name: 'VPopoverContent',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    hide: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<() => void>} */ (
        Function
      ),
      required: true,
    },
    hideOnEsc: {
      type: Boolean,
      default: true,
    },
    hideOnClickOutside: {
      type: Boolean,
      default: true,
    },
    autoFocusOnShow: {
      type: Boolean,
      default: true,
    },
    autoFocusOnHide: {
      type: Boolean,
      default: true,
    },
    triggerElement: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<HTMLElement>} */ (
        process.server ? Object : HTMLElement
      ),
    },
    placement: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<import('@popperjs/core').Placement>} */ (
        String
      ),
      default: 'bottom-end',
      validate: (v) => popoverPlacements.includes(v),
    },
    strategy: {
      type: /** @type {import('@nuxtjs/composition-api').PropType<import('@popperjs/core').PositioningStrategy>} */ (
        String
      ),
      default: 'absolute',
      validate: (v) => ['absolute', 'fixed'].includes(v),
    },
    zIndex: {
      type: Number,
    },
  },
  /**
   * This is the only documented emitted event but in reality we pass through `$listeners`
   * to the underlying element so anything and everything is emitted. `@keydown` is the
   * only one this component overrides and controls (but ultimately still emits).
   */
  emits: ['keydown', 'blur'],
  setup(props, { emit, attrs }) {
    provide(VPopoverContentContextKey, true)
    if (!attrs['aria-label'] && !attrs['aria-labelledby']) {
      warn('You should provide either `aria-label` or `aria-labelledby` props.')
    }

    const propsRefs = toRefs(props)
    const popoverRef = ref()
    const { onKeyDown, onBlur, popoverMaxHeightRef } = usePopoverContent({
      popoverRef,
      popoverPropsRefs: propsRefs,
      emit,
    })
    console.log('popoverMaxHeightRef: ', popoverMaxHeightRef.value)

    return { popoverRef, onKeyDown, onBlur }
  },
})
</script>
