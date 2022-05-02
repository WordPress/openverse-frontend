state
<template>
  <div
    v-bind="disclosureContent.attributes"
    ref="node"
    :class="disclosureContent.classes"
    v-on="disclosureContent.listeners"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRef } from '@nuxtjs/composition-api'

import type { DisclosureState } from '~/ariakit/disclosure/use-disclosure-state'
import { useDisclosureContent } from '~/ariakit/disclosure/use-disclosure-content'

/**
 * The default implementation of the DisclosureContent
 * pattern. Most use cases probably don't need more than
 * this, but those that do can hook into `useDisclosureContent`
 * themselves for more control.
 */
export default defineComponent({
  name: 'VDisclosureContent',
  props: {
    state: {
      type: Object as PropType<DisclosureState>,
      required: true,
    },
    hidden: {
      type: Boolean as PropType<boolean | undefined>,
      required: false,
    },
    id: {
      type: String,
      required: true,
    },
  },
  emits: {
    transitionend: null as unknown as (e: TransitionEvent) => void,
    animationend: null as unknown as (e: AnimationEvent) => void,
  },
  setup(props, { emit }) {
    const node = ref<HTMLDivElement | null>(null)
    const disclosureContent = useDisclosureContent({
      node,
      state: props.state,
      id: props.id,
      hidden: toRef(props, 'hidden'),
      onTransitionEnd: (e) => emit('transitionend', e),
      onAnimationEnd: (e) => emit('animationend', e),
    })

    return { node, disclosureContent }
  },
})
</script>
