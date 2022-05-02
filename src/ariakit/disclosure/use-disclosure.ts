import {
  Ref,
  ref,
  toRefs,
  isRef,
  watch,
  computed,
} from '@nuxtjs/composition-api'

import type { DisclosureState } from '~/ariakit/disclosure/use-disclosure-state'

export interface UseDisclosureOptions {
  node: Ref<HTMLElement | null>
  state: DisclosureState
  toggleOnClick?: Ref<boolean> | ((e: MouseEvent) => boolean)
  onMouseDown?: (event: MouseEvent) => void
  onClick?: (event: MouseEvent) => void
}

export const useDisclosure = ({
  node,
  state,
  ...options
}: UseDisclosureOptions) => {
  const expanded = ref(false)
  const disclosureStateRefs = toRefs(state.values)

  watch(
    [
      disclosureStateRefs.disclosureElement,
      disclosureStateRefs.visible,
    ] as const,
    ([currentDisclosure, visible]) => {
      if (!currentDisclosure || !currentDisclosure.isConnected) {
        state.setDisclosureElement(node.value)
      }
      const isCurrentDisclosure = state.values.disclosureElement === node.value
      expanded.value = visible && isCurrentDisclosure
    }
  )

  const onMouseDown = (event: MouseEvent) => {
    state.setDisclosureElement(event.currentTarget as HTMLElement | null)
    options.onMouseDown?.(event)
  }

  const toggleOnClick = computed(() => {
    if (
      typeof options.toggleOnClick === 'undefined' ||
      isRef<boolean>(options.toggleOnClick)
    ) {
      const value = options.toggleOnClick?.value ?? false
      return () => value
    }

    return options.toggleOnClick
  })

  const onClick = (event: MouseEvent) => {
    state.setDisclosureElement(event.currentTarget as HTMLElement | null)
    options.onClick?.(event)
    if (event.defaultPrevented) return
    if (node.value && 'data-disclosure' in node.value) return
    if (!toggleOnClick.value(event)) return
    state.toggle()
  }

  const attributes = computed(() => ({
    'data-disclosure': 'true',
    'aria-expanded': expanded.value,
    'aria-controls': state.values.contentElement?.id,
  }))

  return {
    attributes,
    listeners: {
      mousedown: onMouseDown,
      click: onClick,
    },
  }
}
