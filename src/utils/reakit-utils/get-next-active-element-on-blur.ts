// From https://github.com/ariakit/ariakit/blob/da876223f115304c8f5c12a5f04212601d9b3027/packages/reakit/src/Composite/__utils/getNextActiveElementOnBlur.ts
import { getActiveElement } from '~/utils/reakit-utils/dom'

const isIE11 = typeof window !== 'undefined' && 'msCrypto' in window

export function getNextActiveElementOnBlur(event: FocusEvent) {
  // IE 11 doesn't support event.relatedTarget on blur.
  // document.activeElement points the next active element.
  // On modern browsers, document.activeElement points to the current target.
  if (isIE11) {
    const activeElement = getActiveElement(event.target as HTMLElement)
    return activeElement as HTMLElement | null
  }
  return event.relatedTarget as HTMLElement | null
}
