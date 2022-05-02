import { contains } from './dom'

/**
 * Returns `true` if `event` has been fired within a Vue Teleport element.
 */
export function isPortalEvent(event: Event): boolean {
  return !contains(
    event.currentTarget as Element | null,
    event.target as Element
  )
}

/**
 * Returns `true` if `event.target` and `event.currentTarget` are the same.
 */
export function isSelfTarget(event: Event): boolean {
  return event.target === event.currentTarget
}

/**
 * Creates and dispatches an event.
 * @example
 * ```typescript
 * fireEvent(document.getElementById("id"), "blur", {
 *   bubbles: true,
 *   cancelable: true,
 * });
 * ```
 */
export function fireEvent(
  element: Element,
  type: string,
  eventInit?: EventInit
) {
  const event = new Event(type, eventInit)
  return element.dispatchEvent(event)
}

/**
 * Creates and dispatches a blur event.
 * @example
 * fireBlurEvent(document.getElementById("id"));
 */
export function fireBlurEvent(element: Element, eventInit?: FocusEventInit) {
  const event = new FocusEvent('blur', eventInit)
  const defaultAllowed = element.dispatchEvent(event)
  const bubbleInit = { ...eventInit, bubbles: true }
  element.dispatchEvent(new FocusEvent('focusout', bubbleInit))
  return defaultAllowed
}

/**
 * Creates and dispatches a keyboard event.
 * @example
 * ```typescript
 * fireKeyboardEvent(document.getElementById("id"), "keydown", {
 *   key: "ArrowDown",
 *   shiftKey: true,
 * });
 * ```
 */
export function fireKeyboardEvent(
  element: Element,
  type: string,
  eventInit?: KeyboardEventInit
) {
  const event = new KeyboardEvent(type, eventInit)
  return element.dispatchEvent(event)
}

/**
 * Creates and dispatches a click event.
 * @example
 * fireClickEvent(document.getElementById("id"));
 */
export function fireClickEvent(element: Element, eventInit?: PointerEventInit) {
  const event =
    typeof PointerEvent !== 'undefined'
      ? new PointerEvent('click', eventInit)
      : new MouseEvent('click', eventInit)
  return element.dispatchEvent(event)
}

/**
 * Checks whether the focus/blur event is happening from/to outside of the
 * container element.
 * @example
 * ```typescript
 * const element = document.getElementById("id");
 * element.addEventListener("blur", (event) => {
 *   if (isFocusEventOutside(event)) {
 *     // ...
 *   }
 * });
 * ```
 */
export function isFocusEventOutside(
  event: FocusEvent,
  container?: Element | null
) {
  const containerElement = container || (event.currentTarget as Element)
  const relatedTarget = event.relatedTarget as HTMLElement | null
  return !relatedTarget || !contains(containerElement, relatedTarget)
}

/**
 * Runs a callback on the next animation frame, but before a certain event.
 */
export function queueBeforeEvent(
  element: Element,
  type: string,
  callback: () => void
) {
  const raf = requestAnimationFrame(() => {
    element.removeEventListener(type, callImmediately, true)
    callback()
  })
  const callImmediately = () => {
    cancelAnimationFrame(raf)
    callback()
  }
  // By listening to the event in the capture phase, we make sure the callback
  // is fired before the respective React events.
  element.addEventListener(type, callImmediately, {
    once: true,
    capture: true,
  })
  return raf
}

/**
 * Adds a global event listener, including on child frames.
 */
export function addGlobalEventListener<K extends keyof DocumentEventMap>(
  type: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: (event: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
  scope?: Window
): () => void
export function addGlobalEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  scope?: Window
): () => void
export function addGlobalEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  scope: Window = window
) {
  // Prevent errors from "sandbox" frames.
  try {
    scope.document.addEventListener(type, listener, options)
  } catch (e) {
    /* do nothing */
  }

  const listeners: Array<() => void> = []
  for (let i = 0; i < scope.frames.length; i += 1) {
    const frameWindow = scope.frames[i]
    if (frameWindow) {
      listeners.push(
        addGlobalEventListener(type, listener, options, frameWindow)
      )
    }
  }
  const removeEventListener = () => {
    try {
      scope.document.removeEventListener(type, listener, options)
    } catch (e) {
      /* do nothing */
    }
    listeners.forEach((listener) => listener())
  }
  return removeEventListener
}
