export const AUDIO = 'audio'
export const IMAGE = 'image'
export const VIDEO = 'video'
export const ALL_MEDIA = 'all'

/** @typedef {'audio'|'image'|'video'|'all'} MediaType */

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
