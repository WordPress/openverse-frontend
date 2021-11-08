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
export function usePopoverState({
  popoverRef,
  disclosureRef,
  popoverPropsRefs,
}) {
  /** @type {import('./types').Ref<import('@popperjs/core').Instance>} */
  const popperInstanceRef = ref()
  /** @type {import('./types').Ref<[number, number]>} */
  const offsetRef = ref()

  watch(
    [popoverPropsRefs.gutter],
    ([gutter]) => (offsetRef.value = [0, gutter]),
    { immediate: true }
  )

  watch(
    [
      popoverPropsRefs.visible,
      popoverPropsRefs.placement,
      popoverPropsRefs.fixed,
      offsetRef,
    ],
    /**
     * @param {[boolean, import('@popperjs/core').Placement, boolean, [number, number]]} deps
     * @param {unknown} _
     * @param {(cb: () => void) => void} onInvalidate
     */
    ([visible, placement, fixed, offset], _, onInvalidate) => {
      if (!(disclosureRef.value && popoverRef.value)) return

      popperInstanceRef.value = createPopper(
        disclosureRef.value,
        popoverRef.value,
        {
          placement,
          strategy: fixed ? 'fixed' : 'absolute',
          modifiers: [
            {
              name: 'eventListeners',
              enabled: visible,
            },
            {
              name: 'applyStyles',
              enabled: false,
            },
            {
              name: 'offset',
              options: { offset },
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
}
