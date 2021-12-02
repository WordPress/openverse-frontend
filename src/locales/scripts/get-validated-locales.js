const fs = require('fs')
const localesList = require('./locales-list.json')

/**
 * Returns a list of locale objects with at least one translated string
 * @returns {{code: *, wpLocale: *, file: string, iso: *, name: *, dir: *}[]}
 */
const getValidatedLocales = () => {
  return Object.values(localesList)
    .map((locale) => ({
      code: locale.slug,
      name: locale.englishName,
      iso: locale.langCodeIso_639_1,
      wpLocale: locale.wpLocale,
      dir: locale.textDirection,
      file: `${locale.slug}.json`,
    }))
    .filter((i) => fs.existsSync(process.cwd() + `/src/locales/${i.file}`))
}

try {
  let locales = getValidatedLocales()
  const fileName = 'valid-locales.json'
  fs.writeFileSync(
    process.cwd() + `/src/locales/scripts/` + fileName,
    JSON.stringify(locales, null, 2) + '\n'
  )
  console.log(`> Wrote locale metadata for @nuxt/i18n.`)
} catch (err) {
  console.error(err)
}
