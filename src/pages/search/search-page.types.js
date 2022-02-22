export const propTypes = {
  searchResultItems: {
    type: /** @type {{ [key: 'audio'|'image'|'video']: import('../../store/types').MediaResult[]} */ (
      Object
    ),
    required: true,
  },
  fetchState: {
    type: /** @type {import('../../store/types').FetchState[]} */ (Object),
    required: true,
  },
  isFilterVisible: {
    type: Boolean,
    required: false,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  supported: {
    type: Boolean,
    required: false,
  },
}

/** @typedef {import('@nuxtjs/composition-api').ExtractPropTypes<typeof propTypes>} Props */
