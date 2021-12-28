import {
  computed,
  reactive,
  ref,
  useContext,
  // useRoute,
  // useRouter,
} from '@nuxtjs/composition-api'
import { SEARCH } from '~/constants/store-modules'
import { UPDATE_QUERY } from '~/constants/action-types'

export default function useContentType() {
  const { store } = useContext()
  // const route = useRoute()
  // const router = useRouter()

  const contentTypes = reactive(['all', 'audio', 'image'])

  const activeType = computed(() => store.state.search.searchType)
  const previousContentType = ref(activeType.value)
  const setActiveType = async (contentType) => {
    if (previousContentType.value === contentType) return
    await store.dispatch(`${SEARCH}/${UPDATE_QUERY}`, {
      searchType: contentType,
    })
    previousContentType.value = contentType
    // const type = contentType === 'all' ? '' : contentType

    // const newPath = app.localePath({
    //   path: `/search/${type}`,
    //   query: route.value.query,
    // })
    // router.push(newPath)
  }
  return {
    setActiveType,
    activeType,
    types: contentTypes,
  }
}
