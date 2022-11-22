import type { LocaleObject } from '@nuxtjs/i18n'

const BASE_URL = 'https://translate.wordpress.org/projects/meta/openverse/'

export const needsTranslationBanner = (locale: LocaleObject) => {
  if (!locale || locale.code === 'en') return false

  return (locale.translated ?? 100) <= 90
}

export const createTranslationLink = (locale: LocaleObject) =>
  `${BASE_URL}${locale.code || 'en'}/default/`
