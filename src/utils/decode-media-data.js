import decodeData from '~/utils/decode-data'
import { IMAGE } from '~/constants/media'

/**
 * @template {import('../store/types').MediaDetail} T
 * @param {T} media
 * @param {import('../constants/media').MediaType} mediaType
 * @return {T}
 */
export default function decodeMediaData(media, mediaType = IMAGE) {
  return {
    ...media,
    creator: decodeData(media.creator),
    title: decodeData(media.title)
      ? decodeData(media.title)
      : mediaType === IMAGE
      ? 'Image'
      : 'Audio',
    tags: media.tags
      ? media.tags.map((tag) => ({ ...tag, name: decodeData(tag.name) }))
      : [],
  }
}
