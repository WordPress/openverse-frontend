import { ref } from '@nuxtjs/composition-api'
import { placements as popoverPlacements } from '@popperjs/core'

export const propTypes = {
  visible: {
    type: Boolean,
    required: true,
  },
  hide: {
    type: /** @type {import('@nuxtjs/composition-api').PropType<() => void>} */ (Function),
    required: true,
  },
  hideOnEsc: {
    type: Boolean,
    default: true,
  },
  hideOnClickOutside: {
    type: Boolean,
    default: true,
  },
  autoFocusOnShow: {
    type: Boolean,
    default: true,
  },
  autoFocusOnHide: {
    type: Boolean,
    default: true,
  },
  getDisclosureElementRef: {
    type: /** @type {import('@nuxtjs/composition-api').PropType<() => import('@nuxtjs/composition-api').Ref<HTMLElement>>} */ (Function),
    default: () => ref(),
  },
  finalFocusElement: {
    type: /** @type {import('@nuxtjs/composition-api').PropType<HTMLElement>} */ (process.server
      ? Object
      : HTMLElement),
  },
  gutter: {
    type: Number,
    default: 8,
  },
  placement: {
    type: /** @type {import('@nuxtjs/composition-api').PropType<import('@popperjs/core').Placement>} */ (String),
    default: 'bottom-end',
    validate: (v) => popoverPlacements.includes(v),
  },
  fixed: {
    type: Boolean,
    default: true,
  },
}

/** @typedef {import('@nuxtjs/composition-api').ExtractPropTypes<typeof propTypes>} Props */
