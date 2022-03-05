import { title } from 'case'

import { decodeData as decodeString } from '~/utils/decode-data'
import type { supportedMediaTypes } from '~/constants/media'
import { IMAGE } from '~/constants/media'
import type { ApiMedia, Media } from '~/models/media'

type MediaType = typeof supportedMediaTypes[number]

/**
 * For any given media, decode the media title, creator name and individual tag
 * names. Also populates the `frontendMediaType` field on the model.
 *
 * @param media - the media object of which to decode attributes
 * @param mediaType - the type of the media
 * @returns the given media object with the text fields decoded
 */
export const decodeMediaData = (
  media: ApiMedia,
  mediaType: MediaType = IMAGE
): Media => ({
  ...media,
  frontendMediaType: mediaType,
  title: decodeString(media.title) || title(mediaType),
  creator: decodeString(media.creator),
  tags: (media.tags ?? []).map((tag) => ({
    ...tag,
    name: decodeString(tag.name),
  })),
})
