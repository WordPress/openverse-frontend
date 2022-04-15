import { ref, watch, Ref } from '@nuxtjs/composition-api'

import { getNextActiveElementOnBlur } from '~/utils/a11y/get-next-active-element-on-blur'
import { getDocument, getActiveElement } from '~/utils/a11y/dom'

interface Props {
  dialogRef: Ref<HTMLElement>
  visibleRef: Ref<boolean>
}

function isActualElement(element: Element | null): element is Element {
  return Boolean(
    element &&
      element.tagName &&
      element.tagName !== 'HTML' &&
      element !== getDocument(element).body
  )
}

function useBlurTracker() {
  const blurredRef = ref(0)

  const scheduleFocus = () => (blurredRef.value += 1)

  return [blurredRef, scheduleFocus] as const
}

export function useFocusOnBlur({ dialogRef, visibleRef }: Props) {
  const [blurredRef, scheduleFocus] = useBlurTracker()

  watch([blurredRef], ([blurred]) => {
    if (!visibleRef.value) return
    if (!blurred) return
    if (!isActualElement(getActiveElement(dialogRef.value))) {
      dialogRef.value?.focus()
    }
  })

  const onBlur = (event: FocusEvent) => {
    if (visibleRef.value) return
    const nextActiveElement = getNextActiveElementOnBlur(event)
    if (!isActualElement(nextActiveElement)) {
      scheduleFocus()
    }
  }

  return onBlur
}
