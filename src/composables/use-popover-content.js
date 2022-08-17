import { ref, watch } from '@nuxtjs/composition-api'

import { detectOverflow } from '@popperjs/core'

import { usePopper } from '~/composables/use-popper'

import { useDialogContent } from './use-dialog-content'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').ToRefs<import('~/components/VPopover/VPopoverContent.types').Props>} popoverPropsRefs
 * @property {import('@nuxtjs/composition-api').SetupContext['emit']} emit
 */

/**
 * @param {Props} props
 */
export function usePopoverContent({ popoverRef, popoverPropsRefs, emit }) {
  const { onKeyDown, onBlur } = useDialogContent({
    dialogRef: popoverRef,
    visibleRef: popoverPropsRefs.visible,
    autoFocusOnShowRef: popoverPropsRefs.autoFocusOnShow,
    autoFocusOnHideRef: popoverPropsRefs.autoFocusOnHide,
    triggerElementRef: popoverPropsRefs.triggerElement,
    hideOnClickOutsideRef: popoverPropsRefs.hideOnClickOutside,
    hideRef: popoverPropsRefs.hide,
    hideOnEscRef: popoverPropsRefs.hideOnEsc,
    emit,
  })

  /** @type {import('@nuxtjs/composition-api').Ref<import('@popperjs/core').Instance>} */
  const popperInstanceRef = usePopper({
    popoverRef,
    popoverPropsRefs,
  })

  /**
   * Detects if the popover is overflowing the viewport,
   * and sets the max-height of the popover accordingly.
   * If there is no overflow, the max-height is set to null.
   * @param {import('@popperjs/core').Instance} popper
   **/
  const detectVerticalOverflow = (popper) => {
    popper.forceUpdate() // make sure that `rects` are set

    const overflow = detectOverflow(popper.state)
    const verticalOverflow = Math.max(
      0,
      Math.max(overflow.bottom, overflow.top)
    )
    const maxHeight =
      verticalOverflow > 0
        ? popper.state.rects.popper.height - verticalOverflow
        : null
    return { verticalOverflow, maxHeight }
  }

  const popoverMaxHeightRef = ref(null)

  watch(popperInstanceRef, (popper) => {
    if (!popper) return

    popoverMaxHeightRef.value = detectVerticalOverflow(popper).maxHeight

    console.log('maxHeight:', popoverMaxHeightRef.value)
  })

  return { onKeyDown, onBlur, popoverMaxHeightRef }
}
