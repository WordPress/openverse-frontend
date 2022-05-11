// Credit: https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/utils/focus-management.ts
import { getDomElement } from '~/utils/dom'

import type { Ref } from '@nuxtjs/composition-api'

function getOwnerDocument<T extends Element | Ref<Element | null>>(
  element: T | null | undefined
) {
  if (typeof window === 'undefined') return null
  if (element instanceof Node) return element.ownerDocument
  if (element && Object.prototype.hasOwnProperty.call(element, 'value')) {
    const domElement = getDomElement(element)
    if (domElement) return domElement.ownerDocument
  }

  return document
}

// Credit:
//  - https://stackoverflow.com/a/30753870
const focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map(
    process.env.NODE_ENV === 'test'
      ? // TODO: Remove this once JSDOM fixes the issue where an element that is
        // "hidden" can be the document.activeElement, because this is not possible
        // in real browsers.
        (selector) =>
          `${selector}:not([tabindex='-1']):not([style*='display: none'])`
      : (selector) => `${selector}:not([tabindex='-1'])`
  )
  .join(',')

export const Focus = Object.freeze({
  /** Focus the first non-disabled element */
  First: 1 << 0,

  /** Focus the previous non-disabled element */
  Previous: 1 << 1,

  /** Focus the next non-disabled element */
  Next: 1 << 2,

  /** Focus the last non-disabled element */
  Last: 1 << 3,

  /** Wrap tab around */
  WrapAround: 1 << 4,
})

export const FocusResult = Object.freeze({
  Error: 'Error' as const,
  Overflow: 'Overflow' as const,
  Success: 'Success' as const,
  Underflow: 'Underflow' as const,
})

export const Direction = Object.freeze({ Next: 1, Previous: -1 })

export function getFocusableElements(
  container: HTMLElement | null = document.body
) {
  if (container == null) return []
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
}

export function isFocusableElement(element: HTMLElement) {
  if (element === getOwnerDocument(element)?.body) return false
  return element.matches(focusableSelector)
}

export function focusElement(element: HTMLElement | null) {
  element?.focus()
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
const selectableSelector = ['textarea', 'input'].join(',')
function isSelectableElement(
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement {
  return element?.matches?.(selectableSelector) ?? false
}

export function sortByDomNode<T>(
  nodes: T[],
  resolveKey: (item: T) => HTMLElement | null = (i) =>
    i as unknown as HTMLElement | null
): T[] {
  return nodes.slice().sort((aItem, zItem) => {
    const a = resolveKey(aItem)
    const z = resolveKey(zItem)

    if (a === null || z === null) return 0

    const position = a.compareDocumentPosition(z)

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

export function focusIn(container: HTMLElement | HTMLElement[], focus: number) {
  const ownerDocument =
    (Array.isArray(container)
      ? container.length > 0
        ? container[0].ownerDocument
        : document
      : container?.ownerDocument) ?? document

  const elements = Array.isArray(container)
    ? sortByDomNode(container)
    : getFocusableElements(container)
  const active = ownerDocument.activeElement as HTMLElement

  const direction = (() => {
    if (focus & (Focus.First | Focus.Next)) return Direction.Next
    if (focus & (Focus.Previous | Focus.Last)) return Direction.Previous

    throw new Error(
      'Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last'
    )
  })()

  const startIndex = (() => {
    if (focus & Focus.First) return 0
    if (focus & Focus.Previous) return Math.max(0, elements.indexOf(active)) - 1
    if (focus & Focus.Next) return Math.max(0, elements.indexOf(active)) + 1
    if (focus & Focus.Last) return elements.length - 1

    throw new Error(
      'Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last'
    )
  })()

  let offset = 0
  const total = elements.length
  let next = undefined
  do {
    // Guard against infinite loops
    if (offset >= total || offset + total <= 0) return FocusResult.Error

    let nextIdx = startIndex + offset

    if (focus & Focus.WrapAround) {
      nextIdx = (nextIdx + total) % total
    } else {
      if (nextIdx < 0) return FocusResult.Underflow
      if (nextIdx >= total) return FocusResult.Overflow
    }

    next = elements[nextIdx]
    // Try the focus the next element, might not work if it is "hidden" to the user.
    next?.focus()
    // Try the next one in line
    offset += direction
  } while (next !== ownerDocument.activeElement)
  if (
    !next.hasAttribute('tabindex') ||
    next.getAttribute('tabindex') === '-1'
  ) {
    next.setAttribute('tabindex', '0')
  }

  if (focus & (Focus.Next | Focus.Previous) && isSelectableElement(next)) {
    next.select()
  }

  return FocusResult.Success
}
