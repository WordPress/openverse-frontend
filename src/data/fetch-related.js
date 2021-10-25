import AudioService from '~/data/audio-service'
import ImageService from '~/data/image-service'
import { AUDIO, IMAGE } from '~/constants/media'

const services = { [AUDIO]: AudioService, [IMAGE]: ImageService }

export const fetchRelated = (
  vm,
  property,
  { mediaType, mediaId, service = services[mediaType] }
) => {
  service.getRelatedMedia({ id: mediaId }).then((response) => {
    vm[property] = response.data.results
  })
}
