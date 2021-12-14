import { ref, useRoute, useRouter } from '@nuxtjs/composition-api'

const searchRoutes = ['search', 'search-image', 'search-audio', 'search-video']

/**
 * Reactive property that returns true only on the `search` routes.
 * Homepage, single image result and other content pages return `false`
 * @returns {{isSearch: import('@nuxtjs/composition-api').Ref<boolean>, route: import('@nuxtjs/composition-api').Ref<string>}}
 */
export const useSearchRoute = () => {
  const route = useRoute()
  const router = useRouter()
  const isSearch = ref(searchRoutes.includes(route.value.name))
  router.beforeEach((to, from, next) => {
    isSearch.value = searchRoutes.includes(to.name)
    next()
  })
  return {
    isSearch,
    route: route.value.name,
  }
}
