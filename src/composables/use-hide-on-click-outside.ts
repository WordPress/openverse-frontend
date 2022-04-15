import { ref, watch, computed, Ref } from '@nuxtjs/composition-api'

import { getDocument } from '~/utils/a11y/dom'

import { useEventListenerOutside } from './use-event-listener-outside'

interface Props {
  dialogRef: Ref<HTMLElement>
  visibleRef: Ref<boolean>
  hideOnClickOutsideRef: Ref<boolean>
  triggerElementRef: Ref<HTMLElement>
  hideRef: Ref<() => void>
}

function useMouseDownTargetRef({
  dialogRef,
  visibleRef,
  hideOnClickOutsideRef,
}: Pick<
  Props,
  'dialogRef' | 'visibleRef' | 'hideOnClickOutsideRef'
>): Ref<EventTarget> {
  const mouseDownTargetRef = ref()

  watch(
    [visibleRef, hideOnClickOutsideRef, dialogRef] as const,
    ([visible, hideOnClickOutside, popover], _, onInvalidate) => {
      if (!(visible && hideOnClickOutside)) return

      const document = getDocument(popover)
      const onMouseDown = (event: MouseEvent) =>
        (mouseDownTargetRef.value = event.target)
      document.addEventListener('mousedown', onMouseDown)
      onInvalidate(() => {
        document.addEventListener('mousedown', onMouseDown)
      })
    },
    { immediate: true }
  )

  return mouseDownTargetRef
}

export function useHideOnClickOutside({
  dialogRef,
  visibleRef,
  hideOnClickOutsideRef,
  triggerElementRef,
  hideRef,
}: Props) {
  const mouseDownTargetRef = useMouseDownTargetRef({
    dialogRef,
    visibleRef,
    hideOnClickOutsideRef,
  })

  const shouldListenRef = computed(
    () => visibleRef.value && hideOnClickOutsideRef.value
  )

  useEventListenerOutside({
    containerRef: dialogRef,
    triggerRef: triggerElementRef,
    eventType: 'click',
    listener: (event) => {
      if (mouseDownTargetRef.value === event.target) {
        // Make sure the element that has been clicked is the same that last
        // triggered the mousedown event. This prevents the dialog from closing
        // by dragging the cursor (for example, selecting some text inside the
        // dialog and releasing the mouse outside of it).
        hideRef.value()
      }
    },
    shouldListenRef,
  })

  useEventListenerOutside({
    containerRef: dialogRef,
    triggerRef: triggerElementRef,
    eventType: 'focusin',
    listener: (event) => {
      const document = getDocument(dialogRef.value)
      if (event.target !== document) {
        hideRef.value()
      }
    },
    shouldListenRef,
  })
}
