import { ref } from '@nuxtjs/composition-api'

import { useFocusOnShow } from '~/composables/use-focus-on-show'
import { useFocusOnHide } from '~/composables/use-focus-on-hide'
import { useHideOnClickOutside } from '~/composables/use-hide-on-click-outside'
import { useFocusOnBlur } from '~/composables/use-focus-on-blur'

import { warn } from '~/utils/console'

import type { Ref, SetupContext } from '@nuxtjs/composition-api'

type Props = {
  dialogElements: {
    dialogRef: Ref<HTMLElement | null>
    initialFocusElementRef: Ref<HTMLElement | null>
    triggerElementRef: Ref<HTMLElement | null>
  }
  dialogOptions?: {
    autoFocusOnShowRef?: Ref<boolean>
    autoFocusOnHideRef?: Ref<boolean>
    hideOnClickOutsideRef?: Ref<boolean>
    hideOnEscRef?: Ref<boolean>
    trapFocusRef?: Ref<boolean>
  }
  visibleRef: Ref<boolean>
  hideRef: Ref<() => void>
  emit: SetupContext["emit"]
  attrs: SetupContext['attrs']
}

export function useDialogContent({
  emit,
  attrs,
  visibleRef,
  hideRef,
  dialogOptions,
  dialogElements: { dialogRef, initialFocusElementRef, triggerElementRef },
}: Props) {
  if (!attrs['aria-label'] && !attrs['aria-labelledby']) {
    warn('You should provide either `aria-label` or `aria-labelledby` props.')
  }

  const autoFocusOnShowRef = dialogOptions?.autoFocusOnShowRef || ref(true)
  const trapFocusRef = dialogOptions?.trapFocusRef || ref(true)
  const autoFocusOnHideRef = dialogOptions?.autoFocusOnHideRef || ref(true)
  const hideOnClickOutsideRef =
    dialogOptions?.hideOnClickOutsideRef || ref(true)
  console.log('hideOnClickOutsideRef', hideOnClickOutsideRef.value)
  const hideOnEscRef = dialogOptions?.hideOnEscRef || ref(true)

  const focusOnBlur = useFocusOnBlur({
    dialogRef,
    visibleRef,
  })
  useFocusOnShow({
    dialogRef,
    visibleRef,
    initialFocusElementRef,

    autoFocusOnShowRef,
    trapFocusRef,
  })
  useFocusOnHide({
    dialogRef,
    triggerElementRef,
    visibleRef,
    autoFocusOnHideRef,
  })
  useHideOnClickOutside({
    dialogRef,
    triggerElementRef,

    hideOnClickOutsideRef,
    hideRef,
    visibleRef,
  })

  const onKeyDown = (event: KeyboardEvent) => {
    emit("keydown", event)

    if (event.defaultPrevented) return
    if (event.key !== "Escape") return
    if (!hideOnEscRef.value) return

    event.stopPropagation()
    hideRef.value()
  }

  const onBlur = (event: FocusEvent) => {
    emit("blur", event)
    focusOnBlur(event)
  }

  return { onKeyDown, onBlur }
}
