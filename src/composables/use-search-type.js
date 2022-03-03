import { computed, ref } from '@nuxtjs/composition-api'

import { useSearchStore } from '~/stores/search'

import { supportedSearchTypes } from '~/constants/media'

import allIcon from '~/assets/icons/all-content.svg'
import audioIcon from '~/assets/icons/audio-content.svg'
import imageIcon from '~/assets/icons/image-content.svg'

const icons = {
  all: allIcon,
  audio: audioIcon,
  image: imageIcon,
}
const searchTypes = [...supportedSearchTypes]

export default function useSearchType() {
  const searchStore = useSearchStore()

  const activeType = computed(() => searchStore.searchType)
  const previousSearchType = ref(activeType.value)
  const setActiveType = (searchType) => {
    if (previousSearchType.value === searchType) return
    searchStore.updateQuery({ searchType })
    previousSearchType.value = searchType
  }
  return {
    setActiveType,
    activeType,
    types: searchTypes,
    icons,
  }
}
