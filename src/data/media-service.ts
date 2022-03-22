import { decodeMediaData } from '~/utils/decode-media-data'
import { VersionedApiService } from '~/data/api-service'

import type { ApiQueryParams, MediaResult } from '~/store/types'
import type { DetailFromMediaType, MediaDetail } from '~/models/media'

import type { SupportedMediaType } from '~/constants/media'

import type { AxiosResponse } from 'axios'

class MediaService<T extends SupportedMediaType> {
  private readonly mediaType: T

  constructor(mediaType: T) {
    this.mediaType = mediaType
  }

  /**
   * Decodes the text data to avoid encoding problems.
   * Also, converts the results from an array of media objects into an object with
   * media id as keys.
   * @param data - search result data
   */
  transformResults(
    data: MediaResult<DetailFromMediaType<T>[]>
  ): MediaResult<Record<string, DetailFromMediaType<T>>> {
    const mediaResults = <DetailFromMediaType<T>[]>data.results
    return {
      ...data,
      results: mediaResults.reduce((acc, item) => {
        acc[item.id] = decodeMediaData(item, this.mediaType)
        return acc
      }, {} as Record<string, DetailFromMediaType<T>>),
    }
  }

  /**
   * Search for media items by keyword.
   * @param params - API search query parameters
   */
  async search(
    params: ApiQueryParams
  ): Promise<MediaResult<Record<string, MediaDetail>>> {
    const res = await VersionedApiService.query<
      MediaResult<DetailFromMediaType<T>[]>
    >(this.mediaType, params as unknown as Record<string, string>)
    return this.transformResults(res.data)
  }

  /**
   * Retrieve media details by its id.
   * SSR-called
   * @param id - the media id to fetch
   */
  async getMediaDetail(id: string): Promise<DetailFromMediaType<T>> {
    if (!id) {
      throw new Error(
        `MediaService.getMediaDetail() id parameter required to retrieve ${this.mediaType} details.`
      )
    }
    const res = await VersionedApiService.get<DetailFromMediaType<T>>(
      this.mediaType,
      id
    )
    return decodeMediaData<T>(res.data, this.mediaType)
  }

  /**
   * Retrieve related media
   * @param params - object with id of the main media, for which to fetch related media
   */
  async getRelatedMedia(params: {
    id: string
  }): Promise<MediaResult<DetailFromMediaType<T>[]>> {
    if (!params.id) {
      throw new Error(
        `MediaService.getRelatedMedia() id parameter required to retrieve related media.`
      )
    }

    const res = (await VersionedApiService.get(
      this.mediaType,
      `${params.id}/related`
    )) as AxiosResponse<MediaResult<DetailFromMediaType<T>[]>>
    return {
      ...res.data,
      results: res.data.results.map((item) =>
        decodeMediaData(item, this.mediaType)
      ) as DetailFromMediaType<T>[],
    }
  }
}

export default MediaService
