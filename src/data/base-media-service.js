import decodeMediaData from '~/utils/decode-media-data.js'

const BaseMediaService = (mediaType) => ({
  transformResults(data) {
    data.results = data.results.reduce((acc, item) => {
      acc[item.id] = {
        ...decodeMediaData(item, mediaType),
        frontendMediaType: mediaType,
      }
      return acc
    }, {})
    return data
  },
})

export default BaseMediaService
