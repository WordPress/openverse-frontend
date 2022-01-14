import { computed, reactive, ref, useContext } from '@nuxtjs/composition-api'
import { SEARCH } from '~/constants/store-modules'
import { UPDATE_QUERY } from '~/constants/action-types'

export default function useContentType() {
  const { store } = useContext()

  const contentTypes = reactive(['all', 'image', 'audio', 'video'])

  const activeType = computed(() => store.state.search.searchType)
  const previousContentType = ref(activeType.value)
  const setActiveType = async (contentType) => {
    if (previousContentType.value === contentType) return
    await store.dispatch(`${SEARCH}/${UPDATE_QUERY}`, {
      searchType: contentType,
    })
    previousContentType.value = contentType
  }
  return {
    setActiveType,
    activeType,
    types: contentTypes,
  }
}
