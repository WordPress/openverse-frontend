import { computed, ref } from '@nuxtjs/composition-api'

import {
  supportedSearchTypes,
  SupportedSearchType,
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  MODEL_3D,
} from '~/constants/media'

import { useSearchStore } from '~/stores/search'
import { useFeatureFlagStore } from '~/stores/feature-flag'

import allIcon from '~/assets/icons/all-content.svg'
import audioIcon from '~/assets/icons/audio-content.svg'
import imageIcon from '~/assets/icons/image-content.svg'
import model3dIcon from '~/assets/icons/model-3d.svg'

const icons = {
  [ALL_MEDIA]: allIcon,
  [AUDIO]: audioIcon,
  [IMAGE]: imageIcon,
  [MODEL_3D]: model3dIcon,
}

export default function useSearchType() {
  const activeType = computed(() => useSearchStore().searchType)
  const previousSearchType = ref(activeType.value)
  const featureFlagStore = useFeatureFlagStore()
  const additionalTypes = computed(() =>
    featureFlagStore.isOn('external_sources') ? ([MODEL_3D] as const) : []
  )
  const searchTypes = [...supportedSearchTypes]
  const setActiveType = (
    searchType: SupportedSearchType | typeof additionalTypes['value'][number]
  ) => {
    if (previousSearchType.value === searchType) return
    useSearchStore().setSearchType(searchType as SupportedSearchType)
    previousSearchType.value = searchType as SupportedSearchType
  }

  return {
    setActiveType,
    activeType,
    types: searchTypes,
    icons,
    additionalTypes,
  }
}
