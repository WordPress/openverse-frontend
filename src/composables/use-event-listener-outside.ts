import { Ref, ref, watch } from '@nuxtjs/composition-api'

import { contains, getDocument, isInDocument } from '~/utils/reakit-utils/dom'

interface Props {
  containerRef: Ref<HTMLElement | null>
  triggerRef: Ref<HTMLElement | null>
  eventType: string
  listener: (e: Event) => void
  shouldListenRef?: Ref<boolean>
}

export const useEventListenerOutside = ({
  containerRef,
  triggerRef,
  eventType,
  listener,
  shouldListenRef,
}: Props) => {
  const boundEventRef = ref()

  watch(
    [containerRef, triggerRef, shouldListenRef || ref(false)] as const,
    ([container, trigger, shouldListen], _, onInvalidate) => {
      if (boundEventRef.value && !shouldListen) {
        const document = getDocument(container)
        document.removeEventListener(eventType, boundEventRef.value)
      }

      if (!shouldListen) return

      boundEventRef.value = (event: Event) => {
        if (!listener || !container || !(event.target instanceof Element))
          return
        const target = event.target

        // When an element is unmounted right after it receives focus, the focus
        // event is triggered after that, when the element isn't part of the
        // current document anymore. So we ignore it.
        if (!isInDocument(target)) return
        // Event inside the container
        if (contains(container, target)) return
        // Event on the trigger
        if (trigger && contains(trigger, target)) return

        listener(event)
      }

      const document = getDocument(container)
      document.addEventListener(eventType, boundEventRef.value)
      onInvalidate(() => {
        if (boundEventRef.value) {
          document.removeEventListener(eventType, boundEventRef.value)
          boundEventRef.value = undefined
        }
      })
    },
    { immediate: true }
  )
}
