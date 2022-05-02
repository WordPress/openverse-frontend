import { ToRefs, toRefs, ref, reactive, watch } from '@nuxtjs/composition-api'

import { useSyncRefs } from '~/composables/use-sync-refs'

import type { SetState } from '~/ariakit/utils/types'

export type DisclosureState = {
  /**
   * A Vue `reactive`
   */
  values: {
    /**
     * The disclosure element ref.
     */
    disclosureElement: HTMLElement | null
    /**
     * The visibility state of the content.
     * @defaultValue false
     */
    visible: boolean
    /**
     * The mounted state of the content. If `animated` is `false` or not defined,
     * this will be the same as `visible`. Otherwise, it will wait for the
     * animation to complete before becoming `false` so the content is not
     * unmounted while animating.
     * @example
     * ```jsx
     * const disclosure = useDisclosureState({ animated: 500 });
     * <Disclosure state={disclosure} />
     * {disclosure.mounted && <DisclosureContent state={disclosure} />}
     * ```
     */
    mounted: boolean
    /**
     * Determines whether the content should animate when it is shown or hidden.
     *   - If `true`, the `animating` state will be `true` when the content is
     *     shown or hidden and it will wait for `stopAnimation` to be called or a
     *     CSS animation/transition to end before becoming `false`.
     *   - If it's set to a number, the `animating` state will be `true` when the
     *     content is shown or hidden and it will wait for the number of
     *     milliseconds to pass before becoming `false`.
     * @defaultValue false
     */
    animated: boolean | number
    /**
     * Whether the content is currently animating.
     */
    animating: boolean
    /**
     * The content element that is being shown or hidden.
     */
    contentElement: HTMLElement | null
  }

  /**
   * Sets the `disclosurElement` state.
   */
  setDisclosureElement: SetState<DisclosureState['values']['disclosureElement']>
  /**
   * Sets the `contentElement` state.
   */
  setContentElement: SetState<DisclosureState['values']['contentElement']>
  /**
   * Sets the `visible` state.
   */
  setVisible: SetState<DisclosureState['values']['visible']>
  /**
   * Sets the `visible` state to `true`.
   */
  show: () => void
  /**
   * Sets the `visible` state to `false`.
   */
  hide: () => void
  /**
   * Sets the `visible` state to the opposite of the current value.
   */
  toggle: () => void
  /**
   * Stops the animation.
   */
  stopAnimation: () => void
}

export type UseDisclosureStateOptions = Partial<
  ToRefs<Pick<DisclosureState['values'], 'visible' | 'animated'>>
> & {
  /**
   * The default visiblity state of the content.
   * @defaultValue false
   */
  defaultVisible?: DisclosureState['values']['visible']
  /**
   * Function that will be called when setting the disclosure `visible` state.
   * @example
   * ```typescript
   * // Uncontrolled example
   * useDisclosureState({ setVisible: (visible) => console.log(visible) });
   * ```
   * @example
   * ```typescript
   * // Controlled example
   * const [visible, setVisible] = useState(false);
   * useDisclosureState({ visible, setVisible });
   * ```
   * @example
   * ```typescript
   * // Externally controlled example
   * function MyDisclosure({ visible, onVisibleChange }) {
   *   const disclosure = useDisclosureState({
   *     visible,
   *     setVisible: onVisibleChange,
   *   });
   * }
   * ```
   */
  setVisible?: (visible: DisclosureState['values']['visible']) => void
}

export function useDisclosureState({
  animated = ref(false),
  ...props
}: UseDisclosureStateOptions): DisclosureState {
  const state = reactive<DisclosureState['values']>({
    disclosureElement: null,
    visible: props.defaultVisible ?? false,
    contentElement: null,
    animating: false,
    mounted: false,
    animated: false,
  })

  useSyncRefs(state, { visible: props.visible, animated })

  const stateRefs = toRefs(state)

  watch(
    [stateRefs.visible, stateRefs.animating] as const,
    ([visible, animating]) => {
      state.mounted = visible || animating
    },
    { immediate: true }
  )

  watch(
    [stateRefs.animated, stateRefs.animating, stateRefs.visible],
    ([animated, animating, visible], [, , prevVisible], onInvalidate) => {
      if (animated && !animating && prevVisible !== visible) {
        state.animating = true
      }

      // We're also listening to the visible state here although it's not used in
      // the effect. This is so we can clear previous timeouts and avoid hiding
      // the content when the disclosure button gets clicked several times in
      // sequence.
      if (typeof animated === 'number' && animating) {
        const timeout = setTimeout(() => (state.animating = false), animated)
        onInvalidate(() => clearTimeout(timeout))
      }
    }
  )

  const setVisible = props.setVisible ?? ((v: boolean) => (state.visible = v))
  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const toggle = () => setVisible(!state.visible)
  const stopAnimation = () => (state.animating = false)
  const setContentElement = (e: HTMLElement | null) =>
    (state.contentElement = e)
  const setDisclosureElement = (e: HTMLElement | null) =>
    (state.disclosureElement = e)

  return {
    values: state,
    show,
    hide,
    toggle,
    stopAnimation,
    setContentElement,
    setDisclosureElement,
    setVisible,
  }
}
