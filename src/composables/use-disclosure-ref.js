import { watch, ref } from '@nuxtjs/composition-api'
import { getDocument, isButton } from 'reakit-utils'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').ToRefs<import('~/components/VPopover/VPopoverContent.types').Props>} popoverPropsRefs
 */

/**
 * @see https://github.com/reakit/reakit/blob/ad7063b0096c19e3295a74213a4ec821683f12ff/packages/reakit/src/Dialog/__utils/useDisclosureRef.ts#L6
 * @param {Props} props
 */
export const useDisclosureRef = ({ popoverRef, popoverPropsRefs }) => {
  /** @type {import('./types').Ref<HTMLElement>)} */
  const disclosureRef = ref()

  watch(
    [popoverRef, popoverPropsRefs.visible],
    /**
     * @param {[HTMLElement, boolean]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([popover, visible], _, onInvalidate) => {
      if (visible) return

      const onFocus = (event) => {
        const target = event.target
        if ('focus' in target) {
          disclosureRef.value = target
        }
        popoverPropsRefs.getDisclosureElementRef.value().value = target
      }

      const document = getDocument(popover)
      document.addEventListener('focusin', onFocus)
      onInvalidate(() => {
        document.removeEventListener('focusin', onFocus)
      })
    },
    { immediate: true }
  )

  watch(
    [
      popoverPropsRefs.getDisclosureElementRef.value(),
      popoverPropsRefs.visible,
    ],
    /**
     * @param {[HTMLElement, boolean]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([disclosureElement, visible], _, onInvalidate) => {
      if (!visible) return

      const onMouseDown = (event) => {
        const element = event.currentTarget
        if (!isButton(element)) return
        event.preventDefault()
        element.focus()
      }

      const disclosure = disclosureElement || disclosureRef.value

      disclosure?.addEventListener('mousedown', onMouseDown)
      onInvalidate(() => {
        disclosure?.removeEventListener('mousedown', onMouseDown)
      })
    },
    { immediate: true }
  )

  return disclosureRef
}
