export const propTypes = {
  status: {
    type: /** @type {'loading'|'idle'} */ (String),
    default: 'idle',
    required: false,
  },
}

/** @typedef {import('#app').ExtractPropTypes<typeof propTypes>} Props */
