const fs = require('fs')
const localesList = require('./locales-list.json')

/**
 * Returns a list of locale objects with at least one translated string
 * @returns {{
 * translated: import('./types').i18nLocaleProps[],
 * untranslated: import('./types').i18nLocaleProps[]
 * }}
 */
const getValidatedLocales = () => {
  const result = {
    translated: [],
    untranslated: [],
  }
  const allLocales = Object.values(localesList).map((locale) => ({
    code: locale.slug,
    name: locale.englishName,
    iso: locale.langCodeIso_639_1,
    wpLocale: locale.wpLocale,
    dir: locale.textDirection,
    translated: locale.translated,
    file: `${locale.slug}.json`,
  }))
  for (const locale of allLocales) {
    if (fs.existsSync(process.cwd() + `/src/locales/${locale.file}`)) {
      result.translated.push(locale)
    } else {
      result.untranslated.push(locale)
    }
  }
  return result
}

try {
  let locales = getValidatedLocales()
  const fileName = 'valid-locales.json'
  fs.writeFileSync(
    process.cwd() + `/src/locales/scripts/` + fileName,
    JSON.stringify(locales.translated, null, 2) + '\n'
  )
  const untranslatedFileName = 'untranslated-locales.json'
  fs.writeFileSync(
    process.cwd() + `/src/locales/scripts/` + untranslatedFileName,
    JSON.stringify(locales.untranslated, null, 2) + '\n'
  )
  console.log(`> Wrote locale metadata for @nuxt/i18n.`)
} catch (err) {
  console.error(err)
}
