import { useNuxtApp } from '#app'

/**
 * This composable exists to make it easy to mock the i18n context
 * in the composition API in tests
 */
export function useI18n() {
  return useNuxtApp().nuxt2Context.$i18n
}

export function useLocalePath() {
  const context = useNuxtApp().nuxt2Context
  return context.localePath.bind(context)
}

export function useLocaleRoute() {
  const context = useNuxtApp().nuxt2Context
  return context.localeRoute.bind(context)
}
