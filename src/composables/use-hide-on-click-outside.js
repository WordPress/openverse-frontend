import { ref, watch } from '@nuxtjs/composition-api'
import { getDocument } from 'reakit-utils'
import { useEventListenerOutside } from './use-event-listener-outside'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').Ref<HTMLElement>} disclosureRef
 * @property {import('./types').ToRefs<import('../components/VPopover/VPopover.types').Props>} popoverPropsRefs
 */

/**
 * @param {Props} props
 * @return {import('./types').Ref<EventTarget>}
 */
function useMouseDownTargetRef({ popoverRef, popoverPropsRefs }) {
  const mouseDownTargetRef = ref()

  watch(
    [popoverPropsRefs.visible, popoverPropsRefs.hideOnClickOutside, popoverRef],
    /**
     * @param {[boolean, boolean, HTMLElement]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([visible, hideOnClickOutside, popover], _, onInvalidate) => {
      if (!(visible && hideOnClickOutside)) return

      const document = getDocument(popover)
      const onMouseDown = (event) => (mouseDownTargetRef.value = event.target)
      document.addEventListener('mousedown', onMouseDown)
      onInvalidate(() => {
        document.addEventListener('mousedown', onMouseDown)
      })
    },
    { immediate: true }
  )

  return mouseDownTargetRef
}

/**
 * @param {Props} props
 */
export function useHideOnClickOutside({
  popoverRef,
  disclosureRef,
  popoverPropsRefs,
}) {
  const mouseDownTargetRef = useMouseDownTargetRef({
    popoverRef,
    popoverPropsRefs,
  })

  const shouldListenRef = ref()

  watch(
    [popoverPropsRefs.visible, popoverPropsRefs.hideOnClickOutside],
    ([visible, hideOnClickOutside]) =>
      (shouldListenRef.value = visible && hideOnClickOutside),
    { immediate: true }
  )

  useEventListenerOutside({
    containerRef: popoverRef,
    disclosureRef,
    eventType: 'click',
    listenerRef: ref((event) => {
      // Make sure the element that has been clicked is the same that last
      // triggered the mousedown event. This prevents the dialog from closing
      // by dragging the cursor (for example, selecting some text inside the
      // dialog and releasing the mouse outside of it).
      if (mouseDownTargetRef.value === event.target) {
        popoverPropsRefs.hide.value?.()
      }
    }),
    shouldListenRef,
  })
}
