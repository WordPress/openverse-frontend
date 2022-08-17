import { ref, watch, Ref, ToRefs } from '@nuxtjs/composition-api'
import {
  createPopper,
  detectOverflow,
  Instance,
  Placement,
  PositioningStrategy,
} from '@popperjs/core'

export type PopoverContentProps = {
  visible: boolean
  hide: () => void
  hideOnEsc: boolean
  hideOnClickOutside: boolean
  autoFocusOnShow: boolean
  autoFocusOnHide: boolean
  triggerElement: HTMLElement
  placement: Placement
  strategy: PositioningStrategy
  zIndex: number
}

type Props = {
  popoverRef: Ref<HTMLElement>
  popoverPropsRefs: ToRefs<PopoverContentProps>
}

export function usePopper({ popoverRef, popoverPropsRefs }: Props) {
  const popperInstanceRef = ref<Instance | undefined>()
  const popperMaxHeightRef = ref<number | null>(null)

  watch(
    [
      popoverPropsRefs.triggerElement,
      popoverPropsRefs.placement,
      popoverPropsRefs.strategy,
      popoverPropsRefs.visible,
      popoverRef,
    ] as const,
    (
      [triggerElement, placement, strategy, visible, popover],
      _,
      onInvalidate
    ) => {
      if (!(triggerElement && popover)) return

      popperInstanceRef.value = createPopper(triggerElement, popover, {
        placement,
        strategy,
        modifiers: [
          {
            name: 'eventListeners',
            enabled: visible,
          },
          {
            name: 'arrow',
            enabled: false,
          },
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      })

      onInvalidate(() => {
        if (popperInstanceRef.value) {
          popperInstanceRef.value.destroy()
          popperInstanceRef.value = undefined
        }
      })
    },
    { immediate: true }
  )

  /**
   * Detects if the popover is overflowing the viewport,
   * and sets the max-height of the popover accordingly.
   * If there is no overflow, the max-height is set to null.
   **/
  const detectMaxHeight = (popper: Instance) => {
    popper.forceUpdate() // make sure that `rects` are set

    const overflow = detectOverflow(popper.state)
    const verticalOverflow = Math.max(
      0,
      Math.max(overflow.bottom, overflow.top)
    )
    return verticalOverflow > 0
      ? popper.state.rects.popper.height - verticalOverflow
      : null
  }

  watch(popperInstanceRef, (popper) => {
    if (!popper) return

    popperMaxHeightRef.value = detectMaxHeight(popper)
  })

  return popperMaxHeightRef
}
