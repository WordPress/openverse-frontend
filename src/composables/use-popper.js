import { ref, watch } from '@nuxtjs/composition-api'
import { createPopper } from '@popperjs/core'

/**
 * @typedef Props
 * @property {import('./types').Ref<HTMLElement>} popoverRef
 * @property {import('./types').Ref<HTMLElement>} disclosureRef
 * @property {import('./types').ToRefs<import('../VPopoverContent.types').Props>} popoverPropsRefs
 */

/**
 * @param {Props} props
 */
export function usePopper({ popoverRef, disclosureRef, popoverPropsRefs }) {
  /** @type {import('./types').Ref<import('@popperjs/core').Instance>} */
  const popperInstanceRef = ref()

  watch(
    [popoverPropsRefs.visible, popoverPropsRefs.placement],
    /**
     * @param {[boolean, import('@popperjs/core').Placement]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([visible, placement], _, onInvalidate) => {
      if (!(disclosureRef.value && popoverRef.value)) return

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
