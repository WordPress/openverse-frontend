import AudioService from '~/data/audio-service'
import ImageService from '~/data/image-service'
import { useLazyAsyncData } from '#app'
import { AUDIO, IMAGE } from '~/constants/media'

const services = { [AUDIO]: AudioService, [IMAGE]: ImageService }

export default function useRelated({
  mediaType,
  mediaId,
  service = services[mediaType],
}) {
  const {
    data: media,
    refresh,
    pending,
    error,
  } = useLazyAsyncData(
    'related',
    async () => {
      return service
        .getRelatedMedia({
          id: mediaId.value,
        })
        .then((r) => r.data.results)
    },
    {
      default: () => [],
    }
  )
  refresh()
  return { media, pending, error }
}
