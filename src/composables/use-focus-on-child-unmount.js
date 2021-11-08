import { watch } from '@nuxtjs/composition-api'
import { getDocument, getActiveElement } from 'reakit-utils'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').ToRefs<import('../components/VPopover/VPopover.types').Props>} popoverPropsRefs
 */

/**
 * @see https://github.com/reakit/reakit/blob/8ae0da741ca45fed6bc1a7c25a3fc9aa60340b44/packages/reakit/src/Dialog/__utils/useFocusOnChildUnmount.ts#L11
 * @param {Props} props
 */
export const useFocusOnChildUnmount = ({ popoverRef, popoverPropsRefs }) => {
  watch(
    [popoverRef, popoverPropsRefs.visible],
    /**
     * @param {[HTMLElement, boolean]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([popover, visible], _, onInvalidate) => {
      if (!popover || !visible) return

      const observer = new MutationObserver((mutations) => {
        const [{ target }] = mutations

        if (target !== popover) return
        const document = getDocument(popover)
        const activeElement = getActiveElement(popover)
        if (activeElement === document.body) {
          popover.focus()
        }
      })

      observer.observe(popover, { childList: true, subtree: true })

      onInvalidate(() => {
        observer.disconnect()
      })
    },
    { immediate: true }
  )
}
