import { ref, watch, Ref } from '@nuxtjs/composition-api'
import { getFirstTabbableIn } from 'reakit-utils/tabbable'
import { hasFocusWithin } from 'reakit-utils/hasFocusWithin'
import { ensureFocus } from 'reakit-utils/ensureFocus'

import { warn } from '~/utils/console'

export const noFocusableElementWarning =
  "It's recommended to have at least one tabbable element inside dialog. The dialog element has been automatically focused. If this is the intended behavior, pass `tabIndex={0}` to the dialog element to disable this warning."

interface Props {
  dialogRef: Ref<HTMLElement>
  visibleRef: Ref<boolean>
  autoFocusOnShowRef: Ref<boolean>
  initialFocusElementRef?: Ref<HTMLElement | undefined>
}

/**
 * @see https://github.com/reakit/reakit/blob/bce9b8a0e567983f61b5cc627f8dee9461986fab/packages/reakit/src/Dialog/__utils/useFocusOnShow.ts#L9
 */
export const useFocusOnShow = ({
  dialogRef,
  visibleRef,
  autoFocusOnShowRef,
  initialFocusElementRef = ref(),
}: Props) => {
  watch(
    [
      dialogRef,
      visibleRef,
      autoFocusOnShowRef,
      initialFocusElementRef,
    ] as const,
    ([dialog, visible, autoFocusOnShow, initialFocusElement]): void => {
      if (!dialog || !visible || !autoFocusOnShow) return

      const isActive = () => hasFocusWithin(dialog)

      if (initialFocusElement) {
        ensureFocus(initialFocusElement, {
          preventScroll: true,
          isActive,
        })
        return
      }

      const tabbable = getFirstTabbableIn(dialog, true)

      if (tabbable) {
        ensureFocus(tabbable, { preventScroll: true, isActive })
      } else {
        ensureFocus(dialog, { preventScroll: true, isActive })
        if (dialog.tabIndex === undefined || dialog.tabIndex < 0) {
          warn(noFocusableElementWarning)
        }
      }
    }
  )
}
