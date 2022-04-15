import { watch, Ref } from '@vue/composition-api'

import { isTabbable, ensureFocus } from '~/utils/a11y/focus'
import { getActiveElement, contains } from '~/utils/a11y/dom'

interface Props {
  dialogRef: Ref<HTMLElement>
  triggerElementRef: Ref<HTMLElement>
  visibleRef: Ref<boolean>
  autoFocusOnHideRef: Ref<boolean>
}

function hidByFocusingAnotherElement(popover: HTMLElement) {
  if (!popover) return false

  const activeElement = getActiveElement(popover)

  if (!activeElement) return false
  if (contains(popover, activeElement)) return false
  if (isTabbable(activeElement)) return true

  return activeElement.getAttribute('data-popover') === 'true'
}

export const useFocusOnHide = ({
  dialogRef,
  triggerElementRef,
  visibleRef,
  autoFocusOnHideRef,
}: Props) => {
  watch(
    [dialogRef, triggerElementRef, visibleRef, autoFocusOnHideRef] as const,
    (
      [dialog, triggerElement, visible, autoFocusOnHide],
      [, , previousVisible]
    ) => {
      const shouldFocus =
        autoFocusOnHide && !visible && visible !== previousVisible

      if (!shouldFocus) return

      if (hidByFocusingAnotherElement(dialog)) return

      ensureFocus(triggerElement)
    }
  )
}
