import { watch, ref, Ref } from '@nuxtjs/composition-api'

import { getDocument, contains } from '~/utils/a11y/dom'

function isInDocument(target: Element) {
  const document = getDocument(target)
  if (target.tagName === 'HTML') return true
  return contains(document.body, target)
}

interface Props {
  containerRef: Ref<HTMLElement>
  triggerRef: Ref<HTMLElement>
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

      const onEvent = (event: Event) => {
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

      boundEventRef.value = onEvent

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
