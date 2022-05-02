import { Ref, watch, toRefs, ref, computed } from '@nuxtjs/composition-api'

import { isSelfTarget } from '~/ariakit/utils/events'

import type { DisclosureState } from '~/ariakit/disclosure/use-disclosure-state'
import type { NodeRef } from '~/ariakit/utils/types'

export interface UseDisclosureContentOptions {
  node: NodeRef
  state: DisclosureState
  hidden?: Ref<boolean | undefined>
  id: string
  onTransitionEnd?: (e: TransitionEvent) => void
  onAnimationEnd?: (e: AnimationEvent) => void
}

export const useDisclosureContent = ({
  node,
  state,
  hidden,
  id,
  ...options
}: UseDisclosureContentOptions) => {
  watch(
    node,
    (contentElement) => {
      if (state.values.contentElement !== contentElement) {
        state.setContentElement(contentElement)
      }
    },
    { immediate: true }
  )

  const transition = ref<'enter' | 'leave' | null>(null)
  let raf = 0

  const disclosureStateRefs = toRefs(state.values)
  watch(
    [
      disclosureStateRefs.animated,
      disclosureStateRefs.visible,
      disclosureStateRefs.animating,
    ] as const,
    ([animated, visible, animating], _, onInvalidate) => {
      if (!animated) {
        transition.value = null
      }

      // Double RAF is needed so the browser has enough time to paint the
      // default styles before processing the `data-enter` attribute. Otherwise
      // it wouldn't be considered a transition.
      // See https://github.com/ariakit/ariakit/issues/643
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          if (visible) {
            transition.value = 'enter'
          } else if (animating) {
            transition.value = 'leave'
          } else {
            transition.value = null
          }
        })
      })

      onInvalidate(() => cancelAnimationFrame(raf))
    }
  )

  const onEnd = (event: Event) => {
    if (event.defaultPrevented) return
    if (!isSelfTarget(event)) return
    if (!state.values.animating) return
    if (state.values.animated === true) {
      state.stopAnimation()
    }
  }

  const onTransitionEnd = (event: TransitionEvent) => {
    options.onTransitionEnd?.(event)
    onEnd(event)
  }

  const onAnimationEnd = (event: AnimationEvent) => {
    options.onAnimationEnd?.(event)
    onEnd(event)
  }

  const resolvedHidden = computed(() =>
    typeof hidden?.value === 'undefined'
      ? !state.values.mounted
      : !state.values.mounted && hidden?.value === true
  )

  const classes = computed(() => [resolvedHidden.value ? 'hidden' : ''])

  const attributes = computed(() => ({
    'data-enter': transition.value === 'enter' ? 'true' : 'false',
    'data-leave': transition.value === 'leave' ? 'true' : 'false',
    id,
  }))

  return {
    listeners: {
      transitionend: onTransitionEnd,
      animationend: onAnimationEnd,
    },
    attributes,
    classes,
  }
}
