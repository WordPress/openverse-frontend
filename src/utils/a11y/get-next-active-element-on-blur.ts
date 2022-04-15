import { getActiveElement } from '~/utils/a11y/dom'

const isIE11 = 'msCrypto' in window

/**
 * Cross-browser method that returns the next active element (the element that
 * is receiving focus) after a blur event is dispatched. It receives the blur
 * event object as the argument.
 *
 * @example
 * ```typescript
 * import { getNextActiveElementOnBlur } from "reakit-utils";
 *
 * const element = document.getElementById("id");
 * element.addEventListener("blur", (event) => {
 *   const nextActiveElement = getNextActiveElementOnBlur(event);
 * });
 * ```
 */
export function getNextActiveElementOnBlur(event: FocusEvent) {
  // IE 11 doesn't support event.relatedTarget on blur.
  // document.activeElement points the the next active element.
  // On modern browsers, document.activeElement points to the current target.
  if (isIE11) {
    const activeElement = getActiveElement(event.currentTarget as Element)
    return activeElement as HTMLElement | null
  }
  return event.relatedTarget as HTMLElement | null
}
