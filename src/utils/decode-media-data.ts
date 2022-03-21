import { title } from 'case'

import { decodeData as decodeString } from '~/utils/decode-data'
import type { SupportedMediaType } from '~/constants/media'
import { IMAGE } from '~/constants/media'
import type { DetailFromMediaType, FrontendMediaType } from '~/store/types'

/**
 * This interface is a subset of `Media` that types dictionaries sent by the API
 * being decoded in the `decodeMediaData` function.
 */
// interface ApiMedia extends Omit<Media, 'frontendMediaType' | 'title'> {
//   title?: string
// }

/**
 * For any given media, decode the media title, creator name and individual tag
 * names. Also populates the `frontendMediaType` field on the model.
 *
 * @param media - the media object of which to decode attributes
 * @param mediaType - the type of the media
 * @returns the given media object with the text fields decoded
 */
export const decodeMediaData = <T extends FrontendMediaType>(
  media: DetailFromMediaType<T>,
  mediaType: SupportedMediaType = IMAGE
): DetailFromMediaType<T> => ({
  ...media,
  frontendMediaType: mediaType,
  title: decodeString(media.title) || title(mediaType),
  creator: decodeString(media.creator),
  // TODO: remove `?? []`
  tags: (media.tags ?? []).map((tag) => ({
    ...tag,
    name: decodeString(tag.name),
  })),
})
