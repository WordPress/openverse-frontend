import { ref, watch } from '@nuxtjs/composition-api'
import { createPopper } from '@popperjs/core'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').Ref<HTMLElement>} disclosureRef
 * @property {import('./types').ToRefs<import('../components/VPopover/VPopoverContent.types').Props>} popoverPropsRefs
 */

/**
 * @param {Props} props
 */
export function usePopper({ popoverRef, disclosureRef, popoverPropsRefs }) {
  /** @type {import('./types').Ref<import('@popperjs/core').Instance>} */
  const popperInstanceRef = ref()

  watch(
    [
      popoverPropsRefs.visible,
      popoverPropsRefs.placement,
      popoverPropsRefs.gutter,
      disclosureRef,
      popoverRef,
    ],
    /**
     * @param {[boolean, import('@popperjs/core').Placement, number]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([visible, placement, gutter, disclosure, popover], _, onInvalidate) => {
      if (!(disclosure && popover)) return

      popperInstanceRef.value = createPopper(
        disclosureRef.value,
        popoverRef.value,
        {
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
        }
      )

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
