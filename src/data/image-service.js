import ApiService from './api-service'
import decodeMediaData from '~/utils/decode-media-data.js'
import { IMAGE } from '~/constants/media.js'

const ImageService = {
  /**
   * Search for images by keyword.
   */
  search(params) {
    return ApiService.query('images', params)
  },

  transformResults(data) {
    data.results = Object.fromEntries(
      data.results.map((item) => {
        item = decodeMediaData(item, IMAGE)
        return [item.id, item]
      })
    )
    return data
  },

  getProviderCollection(params) {
    return ApiService.query('images', params)
  },

  /**
   * Retrieve image details by Id number.
   * SSR-called
   */
  getMediaDetail(params) {
    if (!params.id) {
      throw new Error(
        '[RWV] ImageService.getMediaDetail() id parameter required to retrieve image details.'
      )
    }

    return ApiService.get('images', params.id)
  },

  getRelatedMedia(params) {
    if (!params.id) {
      throw new Error(
        '[RWV] ImageService.getRelatedImages() id parameter required to retrieve related images.'
      )
    }

    return ApiService.get('recommendations/images', params.id)
  },
}

export default ImageService
