<!-- The focus trap implementation is based on Vueuse UseFocusTrap:
https://github.com/vueuse/vueuse/blob/05fe3170f64896b7ada55b2b1056a9ebe971064c/packages/integrations/useFocusTrap/component.ts -->
<script lang="ts">
import {
  defineComponent,
  h,
  onScopeDispose,
  PropType,
  Ref,
  ref,
  VNodeData,
  watch,
} from '@nuxtjs/composition-api'
import { createFocusTrap, Options } from 'focus-trap'

import { getDomElement } from '~/utils/dom'

import type { FocusTrap } from 'focus-trap'

export interface UseFocusTrapOptions extends Options {
  /**
   * Immediately activate the trap
   */
  immediate?: boolean
}

export default defineComponent<{ as?: 'div' | unknown }>({
  name: 'VFocusTrap',
  props: {
    as: {
      type: String as PropType<'div' | 'form'>,
      default: 'div',
    },
    options: {
      type: Object as PropType<UseFocusTrapOptions>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let trap: undefined | FocusTrap
    const target: Ref<HTMLElement> = ref()

    const activate = () => trap && trap.activate()
    const deactivate = () => trap && trap.deactivate()
    watch(
      () => getDomElement(target),
      (el) => {
        if (!el) return
        trap = createFocusTrap(el, {})
        activate()
      },
      { flush: 'post' }
    )

    // Cleanup on unmount
    onScopeDispose(() => deactivate())

    return () => {
      if (slots.default)
        return h(
          props.as || 'div',
          { ref: target } as VNodeData,
          slots.default()
        )
    }
  },
})
</script>
