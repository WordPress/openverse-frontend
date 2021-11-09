import { ref, watch } from '@nuxtjs/composition-api'
import { createPopper } from '@popperjs/core'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').ToRefs<import('../components/VPopover/VPopoverContent.types').Props>} popoverPropsRefs
 */

/**
 * @param {Props} props
 */
export function usePopper({ popoverRef, popoverPropsRefs }) {
  /** @type {import('./types').Ref<import('@popperjs/core').Instance>} */
  const popperInstanceRef = ref()

  watch(
    [
      popoverPropsRefs.visible,
      popoverPropsRefs.placement,
      popoverPropsRefs.gutter,
      popoverPropsRefs.triggerElement,
      popoverRef,
    ],
    /**
     * @param {[boolean, import('@popperjs/core').Placement, number]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    (
      [visible, placement, gutter, triggerElement, popover],
      _,
      onInvalidate
    ) => {
      if (!(triggerElement && popover)) return

      popperInstanceRef.value = createPopper(triggerElement, popover, {
        placement,
        strategy: 'absolute',
        modifiers: [
          {
            name: 'eventListeners',
            enabled: visible,
          },
          {
            name: 'arrow',
            enabled: false,
          },
          {
            name: 'offset',
            options: {
              offset: [0, gutter],
            },
          },
        ],
      })

      onInvalidate(() => {
        if (popperInstanceRef.value) {
          popperInstanceRef.value.destroy()
          popperInstanceRef.value = undefined
        }
      })
    },
    { immediate: true }
  )

  return popperInstanceRef
}
