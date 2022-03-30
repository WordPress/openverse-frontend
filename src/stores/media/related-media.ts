import { defineStore } from 'pinia'
import { reactive, Ref, ref, toRefs } from '@nuxtjs/composition-api'

import { FetchState, useFetchState } from '~/composables/use-fetch-state'
import { services } from '~/stores/media/services'
import type { DetailFromMediaType, Media } from '~/models/media'
import type { SupportedMediaType } from '~/constants/media'

interface RelatedMediaState {
  media: Media[]
  fetchState: FetchState
}
export const useRelatedMediaStore = defineStore('related-media', () => {
  /* State */
  const mainMediaId: Ref<string | null> = ref(null)
  const relatedFetchState = useFetchState()
  const state: RelatedMediaState = reactive({
    media: [],
    fetchState: relatedFetchState.fetchState,
  })
  const { media, fetchState } = toRefs(state)

  /* Getters */
  const getItemById = (id: string) => state.media.find((item) => item.id === id)

  /* Actions */
  const fetchMedia = async (mediaType: SupportedMediaType, id: string) => {
    mainMediaId.value = id
    relatedFetchState.startFetching()
    let media: DetailFromMediaType<typeof mediaType>[] = []
    try {
      media = (await services[mediaType].getRelatedMedia<typeof mediaType>(id))
        .results
      relatedFetchState.endFetching()
    } catch (error) {
      relatedFetchState.endFetching(
        `Could not fetch related ${mediaType} for id ${id}`
      )
    } finally {
      state.media = media
    }
  }
  return {
    media,
    fetchState,

    getItemById,
    fetchMedia,
  }
})
