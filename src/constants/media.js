export const AUDIO = 'audio'
export const IMAGE = 'image'
export const VIDEO = 'video'
export const ALL_MEDIA = 'all'
export const THREE_D_MODEL = '3d model'

/** @typedef {typeof AUDIO | typeof IMAGE | typeof VIDEO | typeof ALL_MEDIA} MediaType */

/**
 * Media types that the API supports.
 * These types also support custom filters.
 * @type {MediaType[]}
 */
export const supportedMediaTypes = [IMAGE, AUDIO]

/**
 * The types of content that users can search. `All` is also an option here.
 * @type {MediaType[]}
 */
export const supportedContentTypes = [ALL_MEDIA, IMAGE, AUDIO]

/** @typedef {'supported'|'beta'|'additional'} SupportStatus */
/** @type {{SUPPORTED: SupportStatus, ADDITIONAL: SupportStatus, BETA: SupportStatus}}*/
export const statuses = {
  SUPPORTED: 'supported',
  BETA: 'beta',
  ADDITIONAL: 'additional',
}

/** @type {Object.<MediaType, SupportStatus>} */
export const contentStatus = {
  [ALL_MEDIA]: statuses.SUPPORTED,
  [IMAGE]: statuses.SUPPORTED,
  [AUDIO]: statuses.BETA,
  [VIDEO]: statuses.ADDITIONAL,
}
