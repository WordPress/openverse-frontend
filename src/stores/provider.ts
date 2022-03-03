import { capital } from 'case'
import { defineStore } from 'pinia'
import { computed, reactive, Ref, ssrRef, watch } from '@nuxtjs/composition-api'
import axios from 'axios'
// We plan to remove this dependency, so don't need to add types for it:
// https://github.com/WordPress/openverse-frontend/issues/1103
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import clonedeep from 'lodash.clonedeep'

import { env } from '~/utils/env'

import {
  AUDIO,
  IMAGE,
  SupportedMediaType,
  supportedMediaTypes,
} from '~/constants/media'
import { warn } from '~/utils/console'

import { providerServices } from '~/data/media-provider-service'
import type { MediaProvider } from '~/models/media-provider'
import {
  FetchState,
  initialFetchState,
  useFetchState,
} from '~/composables/use-fetch-state'
import { initializeState } from '~/utils/pinia-state'

export interface ProviderState {
  providers: {
    audio: MediaProvider[]
    image: MediaProvider[]
  }
  fetchState: {
    audio: FetchState
    image: FetchState
  }
}

export const initialProviderState: ProviderState = Object.freeze({
  providers: {
    [AUDIO]: [],
    [IMAGE]: [],
  },
  fetchState: {
    [AUDIO]: { ...initialFetchState },
    [IMAGE]: { ...initialFetchState },
  },
})

/**
 * Sorts providers by their source_name property.
 * @param data - initial unordered list of providers
 */
const sortProviders = (data: MediaProvider[]): MediaProvider[] => {
  return [...data].sort((sourceObjectA, sourceObjectB) => {
    const nameA = sourceObjectA.source_name.toUpperCase()
    const nameB = sourceObjectB.source_name.toUpperCase()
    return nameA.localeCompare(nameB)
  })
}
/**
 * Timestamp is used to limit the update frequency to one every 60 minutes per request.
 */
const lastUpdated: Ref<Date | null> = ssrRef(null)

const updateFrequency = parseInt(env.providerUpdateFrequency, 10)

export const useProviderStore = defineStore('provider', () => {
  const state = reactive(
    initializeState<ProviderState>('provider', clonedeep(initialProviderState))
  )
  const _fetchState = {
    [AUDIO]: useFetchState(state.fetchState[AUDIO]),
    [IMAGE]: useFetchState(state.fetchState[IMAGE]),
  }

  watch(
    () => _fetchState,
    (newFetchState) => {
      for (const type of supportedMediaTypes)
        state.fetchState[type] = newFetchState[type].fetchState
    },
    { deep: true, immediate: true }
  )

  /**
   * Returns the display name for provider if available, or capitalizes the given providerCode.
   *
   * @param providerCode - the `source_name` property of the provider
   * @param mediaType - mediaType of the provider
   */
  const getProviderName = (
    providerCode: string,
    mediaType: SupportedMediaType
  ) => {
    const provider = state.providers[mediaType].find(
      (p) => p.source_name === providerCode
    )
    return provider?.display_name || capital(providerCode)
  }

  /**
   * Fetch providers only if there is no data, or if the last update for current request
   * was more than 1 hour ago.
   */
  const needsUpdate = computed(() => {
    const noData = supportedMediaTypes.some(
      (mediaType) => !state.providers[mediaType].length
    )
    if (noData || !lastUpdated.value) {
      return true
    }

    const timeSinceLastUpdate =
      new Date().getTime() - new Date(lastUpdated.value).getTime()
    return timeSinceLastUpdate > updateFrequency
  })

  /**
   * Fetches provider data if no data is available, or if the data is too old.
   * On successful fetch updates lastUpdated value.
   */
  const fetchMediaProviders = async () => {
    if (needsUpdate.value) {
      await Promise.allSettled(
        supportedMediaTypes.map((mediaType) =>
          fetchMediaTypeProviders(mediaType)
        )
      )
      lastUpdated.value = new Date()
    }
  }

  const clearProviderData = () => {
    state.providers = initialProviderState.providers
  }
  /**
   * Fetches providers for a set media type, and initializes the provider filters
   * by calling the search store `initProviderFilters` method.
   */
  const fetchMediaTypeProviders = async (
    mediaType: SupportedMediaType
  ): Promise<void> => {
    _fetchState[mediaType].startFetching()
    let sortedProviders = [] as MediaProvider[]
    try {
      const res = await providerServices[mediaType].getProviderStats()
      sortedProviders = sortProviders(res.data)
      _fetchState[mediaType].endFetching()
    } catch (error: unknown) {
      let errorMessage = `There was an error fetching media providers for ${mediaType}`
      if (error instanceof Error) {
        errorMessage =
          axios.isAxiosError(error) && 'response' in error
            ? `${errorMessage}: ${error.code}`
            : `${errorMessage}: ${error?.message}`
      }
      warn(errorMessage)
      _fetchState[mediaType].endFetching(errorMessage)
    } finally {
      state.providers[mediaType] = sortedProviders
    }
  }

  return {
    state,

    fetchMediaProviders,
    getProviderName,
    test: { clearProviderData },
  }
})
