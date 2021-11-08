import { watch } from '@vue/composition-api'
import {
  isTabbable,
  getActiveElement,
  contains,
  ensureFocus,
  getDocument,
} from 'reakit-utils'
import { warn } from '~/utils/warn'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').Ref<HTMLElement>} disclosureRef
 * @property {import('./types').ToRefs<import('../components/VPopover/VPopover.types').Props>} popoverPropsRefs
 */

/**
 * @param {HTMLElement} popover
 */
function hidByFocusingAnotherElement(popover) {
  if (!popover) return false

  const activeElement = getActiveElement(popover)

  if (!activeElement) return false
  if (contains(popover, activeElement)) return false
  if (isTabbable(activeElement)) return true
  if (activeElement.getAttribute('data-popover') === 'true') return true

  return false
}

/**
 * @param {Props} Props
 */
export const useFocusOnHide = ({
  popoverRef,
  disclosureRef,
  popoverPropsRefs,
}) => {
  watch(
    [
      popoverRef,
      disclosureRef,
      popoverPropsRefs.visible,
      popoverPropsRefs.autoFocusOnHide,
      popoverPropsRefs.finalFocusElement,
    ],
    /**
     * @param {[HTMLElement, HTMLElement, boolean, boolean, HTMLElement]} deps
     */
    ([popover, disclosure, visible, autoFocusOnHide, finalFocusElement]) => {
      const shouldFocus = autoFocusOnHide && !visible

      if (!shouldFocus) return

      if (hidByFocusingAnotherElement(popover)) return

      const finalFocusEl = finalFocusElement || disclosure

      if (finalFocusEl) {
        if (finalFocusEl.id) {
          const document = getDocument(finalFocusEl)
          const compositeElement = document.querySelector(
            `[aria-activedescendant='${finalFocusEl.id}']`
          )
          if (compositeElement) {
            return ensureFocus(compositeElement)
          }
        }
        return ensureFocus(finalFocusEl)
      }

      // Otherwise we couldn't determine what element to return focus to. That's no good!
      warn(
        'Could not determine where to return focus. Please provide a `finalFocusElement` prop.'
      )
    }
  )
}
