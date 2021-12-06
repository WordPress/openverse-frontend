import {
  computed,
  reactive,
  ref,
  useContext,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { SEARCH } from '~/constants/store-modules'
import { UPDATE_QUERY } from '~/constants/action-types'

export default function useContentType() {
  const { app, store } = useContext()
  const route = useRoute()
  const router = useRouter()
  const previousContentType = ref(null)

  const contentTypes = reactive([
    { id: 'all', icon: 'allContent' },
    { id: 'image', icon: 'imageContent' },
    { id: 'audio', icon: 'audioContent' },
  ])

  const activeItem = computed(() => {
    return contentTypes.find(
      (item) => item.id === store.state.search.searchType
    )
  })

  const setActiveContentType = async (contentType) => {
    if (previousContentType.value === contentType) return
    await store.dispatch(`${SEARCH}/${UPDATE_QUERY}`, {
      searchType: contentType,
    })
    previousContentType.value = contentType
    const type = contentType === 'all' ? '' : contentType

    const newPath = app.localePath({
      path: `/search/${type}`,
      query: route.value.query,
    })
    router.push(newPath)
    // await store.dispatch(`${MEDIA}/${FETCH_MEDIA}`, {
    //   mediaType: store.state.search.query.mediaType,
    //   ...route.value.query,
    // })
  }
  return { setActiveContentType, activeItem, contentTypes }
}
