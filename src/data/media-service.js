import ApiService from '~/data/api-service'

import decodeMediaData from '~/utils/decode-media-data'

class MediaService {
  constructor(mediaType) {
    this.mediaType = mediaType
  }
  /**
   * Decodes the text data to avoid encoding problems.
   * Also, converts the results from an array of media objects into an object with
   * media id as keys.
   * @param {import('../store/types').MediaResult<import('../store/types').MediaDetail[]|{}>} data
   * @returns {import('../store/types').MediaResult<import('../store/types').MediaStoreResult>}
   */
  transformResults(data) {
    data.results = data.results.reduce((acc, item) => {
      acc[item.id] = decodeMediaData(item, this.mediaType)
      return acc
    }, {})
    return data
  }
  /**
   * Search for media items by keyword.
   * @param {Object} params
   * @return {Promise<{data: any}>}
   */
  search(params) {
    return ApiService.query(this.mediaType, params)
  }

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
        `MediaService.getMediaDetail() id parameter required to retrieve ${this.mediaType} details.`
      )
    }

    return ApiService.get(this.mediaType, params.id)
  }

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

    return ApiService.get(this.mediaType, `${params.id}/related`)
  }
}

export default MediaService
