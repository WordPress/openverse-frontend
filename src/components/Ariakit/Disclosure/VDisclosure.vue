<template>
  <VButton
    v-bind="disclosure.attributes"
    ref="node"
    v-on="disclosure.listeners"
  >
    <slot />
  </VButton>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

import type { DisclosureState } from '~/ariakit/disclosure/use-disclosure-state'
import { nodeRef } from '~/ariakit/utils/types'
import { useDisclosure } from '~/ariakit/disclosure/use-disclosure'

import VButton from '~/components/VButton.vue'

/**
 * The default implementation of the Disclosure pattern.
 * Most use cases can use this directly. Those that need
 * more control can implement their own version by hooking
 * into `useDisclosure` directly.
 */
export default defineComponent({
  name: 'VDisclosure',
  components: { VButton },
  props: {
    state: {
      type: Object as PropType<DisclosureState>,
      required: true,
    },
    /**
     * Determines whether `state.toggle()` will be called on click.
     * This is useful if you want to handle the toggle logic yourself.
     */
    toggleOnClick: {
      type: [Boolean, Function] as PropType<
        boolean | ((e: MouseEvent) => boolean)
      >,
      default: true,
    },
  },
  emits: {
    mousedown: null as unknown as (e: MouseEvent) => void,
    click: null as unknown as (e: MouseEvent) => void,
  },
  setup(props, { emit }) {
    const node = nodeRef()
    const disclosure = useDisclosure({
      node,
      state: props.state,
      onMouseDown: (e) => emit('mousedown', e),
      onClick: (e) => emit('click', e),
    })
    return { node, disclosure }
  },
})
</script>
