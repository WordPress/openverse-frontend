import { defineStore } from 'pinia'

import axios from 'axios'

import type { Media } from '~/models/media'
import type { SupportedMediaType } from '~/constants/media'
import {
  FetchState,
  initialFetchState,
  updateFetchState,
} from '~/composables/use-fetch-state'
import { services } from '~/stores/media/services'
import { useMediaStore } from '~/stores/media/index'
import { IMAGE } from '~/constants/media'
import { useRelatedMediaStore } from '~/stores/media/related-media'
import { useProviderStore } from '~/stores/provider'

export interface MediaItemState {
  mediaItem: Media | null
  mediaType: SupportedMediaType
  fetchState: FetchState
}

export const useMediaItemStore = defineStore('media-item', {
  state: (): MediaItemState => ({
    mediaItem: null,
    mediaType: IMAGE,
    fetchState: initialFetchState,
  }),

  actions: {
    _updateFetchState(action: 'end' | 'start', option?: string) {
      this.fetchState = updateFetchState(this.fetchState, action, option)
    },

    async fetchMediaItem(type: SupportedMediaType, id: string) {
      const mediaStore = useMediaStore()
      const relatedMediaStore = useRelatedMediaStore()
      const existingItem =
        mediaStore.getItemById(type, id) || relatedMediaStore.getItemById(id)
      if (existingItem) {
        this.mediaType = existingItem.frontendMediaType
        this.mediaItem = existingItem
      } else {
        try {
          this._updateFetchState('start')
          this.mediaItem = await services[type].getMediaDetail(id)
          this.mediaType = type
          const providerStore = useProviderStore()
          this.mediaItem.providerName = providerStore.getProviderName(
            this.mediaItem.provider,
            this.mediaType
          )
          if (this.mediaItem.source) {
            this.mediaItem.sourceName = providerStore.getProviderName(
              this.mediaItem.source,
              this.mediaType
            )
          }
          this._updateFetchState('end')
        } catch (error: unknown) {
          this.mediaItem = null
          this.mediaType = type
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error(`Media of type ${type} with id ${id} not found`)
          } else {
            this.handleMediaError(error)
          }
        }
      }
    },

    /**
     * Throws a new error with a new error message.
     */
    handleMediaError(error: unknown) {
      let errorMessage
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.status === 500
            ? 'There was a problem with our servers'
            : `Request failed with status ${
                error.response?.status ?? 'unknown'
              }`
      } else {
        errorMessage =
          error instanceof Error ? error.message : 'Oops! Something went wrong'
      }

      this._updateFetchState('end', errorMessage)
      throw new Error(errorMessage)
    },
  },
})
