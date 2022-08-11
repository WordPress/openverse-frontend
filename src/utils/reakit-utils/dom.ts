/**
 * Returns `element.ownerDocument || document`.
 */
export function getDocument(node?: Node | null): Document {
  return node ? node.ownerDocument || (node as Document) : document
}

/**
 * Returns `element.ownerDocument.activeElement`.
 */
export function getActiveElement(
  node?: Node | null,
  activeDescendant = false
): HTMLElement | null {
  const { activeElement } = getDocument(node)
  if (!activeElement?.nodeName) {
    // In IE11, activeElement might be an empty object if we're interacting
    // with elements inside of an iframe.
    return null
  }
  if (isFrame(activeElement) && activeElement.contentDocument) {
    return getActiveElement(
      activeElement.contentDocument.body,
      activeDescendant
    )
  }
  if (activeDescendant) {
    const id = activeElement.getAttribute('aria-activedescendant')
    if (id) {
      const element = getDocument(activeElement).getElementById(id)
      if (element) {
        return element
      }
    }
  }
  return activeElement as HTMLElement | null
}

/**
 * Similar to `Element.prototype.contains`, but a little bit faster when
 * `element` is the same as `child`.
 * @example
 * contains(document.getElementById("parent"), document.getElementById("child"));
 */
export function contains(parent: Node, child: Node): boolean {
  return parent === child || parent.contains(child)
}

/**
 * Checks whether `element` is a frame element.
 */
export function isFrame(element: Element): element is HTMLIFrameElement {
  return element.tagName === 'IFRAME'
}

type MsElement = Element & {
  msMatchesSelector: (selector: string) => boolean
}
type WebkitElement = Element & {
  webkitMatchesSelector: (selector: string) => boolean
}
/**
 * Ponyfill for `Element.prototype.matches`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
export function matches(element: Element, selectors: string): boolean {
  if ('matches' in element) {
    return element.matches(selectors)
  }
  if (!element) return false
  if ('msMatchesSelector' in element) {
    return (element as MsElement).msMatchesSelector(selectors)
  }
  return (element as WebkitElement).webkitMatchesSelector(selectors)
}

/**
 * Checks if the element is visible or not.
 */
export function isVisible(element: Element) {
  const htmlElement = element as HTMLElement
  return (
    htmlElement.offsetWidth > 0 ||
    htmlElement.offsetHeight > 0 ||
    element.getClientRects().length > 0
  )
}

type ElementOrNull = Element | null

/**
 * Ponyfill for `Element.prototype.closest`
 * @example
 * closest(document.getElementById("id"), "div");
 * // same as
 * document.getElementById("id").closest("div");
 */
export function closest<K extends keyof HTMLElementTagNameMap>(
  element: Element,
  selectors: K
): HTMLElementTagNameMap[K]
export function closest<K extends keyof SVGElementTagNameMap>(
  element: Element,
  selectors: K
): SVGElementTagNameMap[K]
export function closest<T extends Element = Element>(
  element: Element,
  selectors: string
): T | null
export function closest(element: Element, selectors: string) {
  if ('closest' in element) return element.closest(selectors)
  let el = element as ElementOrNull
  do {
    if (matches(el as Element, selectors)) return element
    el = (element.parentElement || element.parentNode) as ElementOrNull
  } while (el !== null && el.nodeType === 1)
  return null
}

/**
 * Check whether the given element is a text field, where text field is defined
 * by the ability to select within the input.
 * @example
 * isTextField(document.querySelector("div")); // false
 * isTextField(document.querySelector("input")); // true
 * isTextField(document.querySelector("input[type='button']")); // false
 * isTextField(document.querySelector("textarea")); // true
 */
export function isTextField(
  element: Element
): element is HTMLInputElement | HTMLTextAreaElement {
  try {
    const isTextInput =
      element instanceof HTMLInputElement && element.selectionStart !== null
    const isTextArea = element.tagName === 'TEXTAREA'
    return isTextInput || isTextArea || false
  } catch (error) {
    // Safari throws an exception when trying to get `selectionStart`
    // on non-text <input> elements (which, understandably, don't
    // have the text selection API). We catch this via a try/catch
    // block, as opposed to a more explicit check of the element's
    // input types, because of Safari's non-standard behavior. This
    // also means we don't have to worry about the list of input
    // types that support `selectionStart` changing as the HTML spec
    // evolves over time.
    return false
  }
}

/**
 * Returns the element's role attribute, if it has one.
 */
export function getPopupRole(
  element?: Element | null,
  // Type from react.AriaAttributes['aria-haspopup']
  fallback?:
    | boolean
    | 'false'
    | 'true'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog'
) {
  const role = element?.getAttribute('role')
  if (role && allowedPopupRoles.indexOf(role) !== -1) {
    return role as 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid'
  }
  return fallback
}

const allowedPopupRoles = ['dialog', 'menu', 'listbox', 'tree', 'grid']

/**
 * Returns the scrolling container element of a given element.
 */
export function getScrollingElement(
  element?: Element | null
): HTMLElement | Element | null {
  if (!element) return null
  if (element.clientHeight && element.scrollHeight > element.clientHeight) {
    const { overflowY } = getComputedStyle(element)
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden'
    if (isScrollable) return element
  }
  return (
    getScrollingElement(element.parentElement) ||
    document.scrollingElement ||
    document.body
  )
}
