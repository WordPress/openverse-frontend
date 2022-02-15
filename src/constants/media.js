export const AUDIO = 'audio'
export const IMAGE = 'image'
export const VIDEO = 'video'
export const ALL_MEDIA = 'all'

/** @typedef {typeof AUDIO | typeof IMAGE | typeof VIDEO | typeof ALL_MEDIA} MediaType */

/**
 * Media types that the API supports.
 * These types also support custom filters.
 */
export const supportedMediaTypes = /** @type {const} */ ([IMAGE, AUDIO])

/**
 * The types of content that users can search. `All` is also an option here.
 */
export const supportedContentTypes = /** @type {const} */ ([
  ALL_MEDIA,
  IMAGE,
  AUDIO,
])

export const statuses = /** @type {const} */ ({
  SUPPORTED: 'supported',
  BETA: 'beta',
  ADDITIONAL: 'additional',
})

/** @typedef {typeof statuses[keyof typeof statuses]} SupportStatus */

/** @type {Record<MediaType, SupportStatus>} */
export const contentStatus = {
  [ALL_MEDIA]: statuses.SUPPORTED,
  [IMAGE]: statuses.SUPPORTED,
  [AUDIO]: statuses.BETA,
  [VIDEO]: statuses.ADDITIONAL,
}
