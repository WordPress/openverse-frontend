import {
  useContext,
  ref,
  useRoute,
  useRouter,
  Ref,
} from "@nuxtjs/composition-api"

import { ALL_MEDIA, searchTypes, supportedSearchTypes } from "~/constants/media"
import usePages from "~/composables/use-pages"

/**
 * Reactive property that returns true only on the matching routes.
 * Note that routes are matched by name, not the url path.
 *
 * Routes are also localized before comparison, so 'search' becomes
 * 'search__en', for example.
 *
 */
export const useMatchRoute = (
  routes: string[] = []
): { matches: Ref<boolean> } => {
  const { app } = useContext()
  const route = useRoute()
  const router = useRouter()

  const localizedRoutes = routes.map(
    (route) => app.localeRoute({ name: route })?.name
  )
  const matches = ref(localizedRoutes.includes(route.value.name))

  router.beforeEach((to, _from, next) => {
    matches.value = localizedRoutes.includes(to.name)
    next()
  })

  return { matches }
}

/**
 * Reactive property that returns true only on the `search` routes.
 * Homepage, single image result and other content pages return `false`
 */
export const useMatchSearchRoutes = () => {
  const routes = [
    "search",
    ...searchTypes
      .filter((type) => type !== ALL_MEDIA)
      .map((type) => `search-${type}`),
  ]
  return useMatchRoute(routes)
}

/**
 * Reactive property that returns true only on the `search` routes.
 * Homepage, single image result and other content pages return `false`
 */
export const useMatchSingleResultRoutes = () => {
  let routes = [
    ...supportedSearchTypes
      .filter((name) => name !== ALL_MEDIA)
      .map((name) => `${name}-id`),
  ]
  routes = routes.concat(routes.map((name) => `${name}-report`))

  return useMatchRoute(routes)
}

/**
 * Matches the content pages (about, search help, etc.) and the preferences page.
 */
export const useMatchContentPageRoutes = () => {
  const routes = usePages()
    .all.filter((page) => page.link.startsWith("/"))
    .map((page) => page.id)
  routes.push("preferences")
  return useMatchRoute(routes)
}
export const useMatchHomeRoute = () => useMatchRoute(["index"])
