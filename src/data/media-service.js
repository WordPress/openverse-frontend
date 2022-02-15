import ApiService from '~/data/api-service'

import decodeMediaData from '~/utils/decode-media-data'

/**
 * @template {import('../store/types').FrontendMediaType} [T=any]
 */
class MediaService {
  /**
   * @param {T} mediaType
   */
  constructor(mediaType) {
    /** @type {T} */
    this.mediaType = mediaType
  }

  /**
   * Decodes the text data to avoid encoding problems.
   * Also, converts the results from an array of media objects into an object with
   * media id as keys.
   * @param {import('../store/types').MediaResult<T[]>} data
   * @returns {import('../store/types').MediaStoreResult<T>}
   */
  transformResults(data) {
    return {
      ...data,
      results: data.results.reduce((acc, item) => {
        acc[item.id] = decodeMediaData(item, this.mediaType)
        return acc
      }, /** @type {Record<string, import('../store/types').DetailFromMediaType<T>>} */ ({})),
    }
  }

  /**
   * Search for media items by keyword.
   * @param {import('../store/types').ApiQueryParams} params
   * @return {Promise<import('axios').AxiosResponse<import('../store/types').MediaResult<T[]>>>}
   */
  search(params) {
    return ApiService.query(this.mediaType, params)
  }

  /**
   * Retrieve media details by its id.
   * SSR-called
   * @param {{ id: string }} params
   * @return {Promise<import('axios').AxiosResponse<import('../store/types').MediaResult<T>>>}
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
   * @param {{ id: string }} params
   * @return {Promise<import('axios').AxiosResponse<import('../store/types').MediaResult<T[]>>>}
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
