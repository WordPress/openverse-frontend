import ApiService from '~/data/api-service'

import decodeMediaData from '~/utils/decode-media-data'
import { AUDIO, IMAGE } from '~/constants/media'

const slugs = {
  [AUDIO]: 'audio',
  [IMAGE]: 'images',
}

const MediaService = (mediaType) => ({
  slug: slugs[mediaType],
  /**
   * Decodes the text data to avoid encoding problems.
   * Also, converts the results from an array of media objects into an object with
   * media id as keys.
   * @param data
   * @returns {*}
   */
  transformResults(data) {
    data.results = data.results.reduce((acc, item) => {
      acc[item.id] = decodeMediaData(item, mediaType)
      return acc
    }, {})
    return data
  },

  /**
   * Search for media items by keyword.
   * @param {Object} params
   * @return {Promise<{data: any}>}
   */
  search(params) {
    return ApiService.query(this.slug, params)
  },

  /**
   * Retrieve media details by its id.
   * SSR-called
   * @param {object} params
   * @param {string} params.id
   * @return {Promise<{data: any}>}
   */
  getMediaDetail(params) {
    if (!params.id) {
      throw new Error(
        `MediaService.getMediaDetail() id parameter required to retrieve ${mediaType} details.`
      )
    }

    return ApiService.get(this.slug, params.id)
  },

  /**
   * Retrieve related media
   * @param {object} params
   * @param {string} params.id
   * @return {Promise<{data: any}>}
   */
  getRelatedMedia(params) {
    if (!params.id) {
      throw new Error(
        `MediaService.getRelatedMedia() id parameter required to retrieve related media.`
      )
    }

    return ApiService.get(this.slug, `${params.id}/related`)
  },
})

export default MediaService
