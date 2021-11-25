export const propTypes = {
  status: {
    type: /** @type {'loading'|'idle'} */ String,
    default: 'idle',
    required: false,
  },
  /** The string to announce when the loading state is active. Should be localized. */
  loadingLabel: {
    type: String,
    required: true,
  },
}

/** @typedef {import('@nuxtjs/composition-api').ExtractPropTypes<typeof propTypes>} Props */
