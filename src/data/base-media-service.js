import decodeMediaData from '~/utils/decode-media-data.js'

const BaseMediaService = (mediaType) => ({
  transformResults(data) {
    data.results = Object.fromEntries(
      data.results.map((item) => {
        item = decodeMediaData(item, mediaType)
        return [item.id, item]
      })
    )
    return data
  },
})

export default BaseMediaService
