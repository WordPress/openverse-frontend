import { watch } from '@nuxtjs/composition-api'
import { getDocument, contains } from 'reakit-utils'

/**
 * @param {Element} target
 */
function isInDocument(target) {
  const document = getDocument(target)
  if (target.tagName === 'HTML') return true
  return contains(document.body, target)
}

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} containerRef
 * @property {import('./types').Ref<HTMLElement>} disclosureRef
 * @property {string} eventType
 * @property {import('./types').Ref<(e: Event) => void>} listenerRef
 * @property {import('./types').Ref<boolean>} [shouldListenRef]
 */

/**
 * @param {Props} props
 */
export const useEventListenerOutside = ({
  containerRef,
  disclosureRef,
  eventType,
  listenerRef,
  shouldListenRef,
}) => {
  watch(
    [containerRef, disclosureRef, listenerRef, shouldListenRef],
    /**
     * @param {[HTMLElement, HTMLElement, (e: Event) => void, boolean]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([container, disclosure, listener, shouldListen], _, onInvalidate) => {
      if (!shouldListen) return

      /**
       * @param {Event} event
       */
      const onEvent = (event) => {
        if (!listenerRef.value) return
        const target = event.target
        if (!container) return

        // When an element is unmounted right after it receives focus, the focus
        // event is triggered after that, when the element isn't part of the
        // current document anymore. So we ignore it.
        if (!isInDocument(target)) return
        // Event inside the container
        if (contains(container, target)) return
        // Event on the disclosure
        if (disclosure && contains(disclosure, target)) return

        listener(event)
      }

      const document = getDocument(container)
      document.addEventListener(eventType, onEvent)
      onInvalidate(() => document.removeEventListener(eventType, onEvent))
    },
    { immediate: true }
  )
}
