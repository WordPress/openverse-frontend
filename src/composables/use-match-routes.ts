import { useLocaleRoute } from '~/composables/use-i18n'

/**
 * Reactive property that returns true only on the matching routes.
 * Note that routes are matched by name, not the url path.
 *
 * Routes are also localized before comparison, so 'search' becomes
 * 'search__en', for example.
 *
 */
export const useMatchRoute = (routes = []) => {
  const localeRoute = useLocaleRoute()
  const route = useRoute()
  const router = useRouter()
  const localizedRoutes = routes.map(
    (route) => localeRoute({ name: route }).name
  )
  const matches = ref(localizedRoutes.includes(route.name))
  router.beforeEach((to, from, next) => {
    matches.value = localizedRoutes.includes(to.name)
    next()
  })
  return { matches }
}

/**
 * Reactive property that returns true only on the `search` routes.
 * Homepage, single image result and other content pages return `false`
 */
export const useMatchSearchRoutes = () =>
  useMatchRoute(['search', 'search-image', 'search-audio', 'search-video'])

export const useMatchHomeRoute = () => useMatchRoute(['index'])
