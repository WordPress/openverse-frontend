import { useFocusOnShow } from '~/composables/use-focus-on-show'
import { useFocusOnHide } from '~/composables/use-focus-on-hide'
import { useHideOnClickOutside } from '~/composables/use-hide-on-click-outside'
import { useFocusOnBlur } from '~/composables/use-focus-on-blur'

import { keycodes } from '~/constants/key-codes'

import type { ToRefs, SetupContext } from '@nuxtjs/composition-api'

interface InnerProps {
  dialogRef: HTMLElement
  visibleRef: boolean
  autoFocusOnShowRef: boolean
  triggerElementRef: HTMLElement
  autoFocusOnHideRef: boolean
  hideOnClickOutsideRef: boolean
  hideOnEscRef: boolean
  initialFocusElementRef: HTMLElement
  hideRef: () => void
}

type Props = ToRefs<InnerProps> & { emit: SetupContext['emit'] }

export function useDialogContent({ emit, ...props }: Props) {
  const focusOnBlur = useFocusOnBlur(props)
  useFocusOnShow(props)
  useFocusOnHide(props)
  useHideOnClickOutside(props)

  const onKeyDown = (event: KeyboardEvent) => {
    emit('keydown', event)

    if (event.defaultPrevented) return
    if (event.key !== keycodes.Escape) return
    if (!props.hideOnEscRef.value) return

    event.stopPropagation()
    props.hideRef.value()
  }

  const onBlur = (event: FocusEvent) => {
    emit('blur', event)
    focusOnBlur(event)
  }

  return { onKeyDown, onBlur }
}
