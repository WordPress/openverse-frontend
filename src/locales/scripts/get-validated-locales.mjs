import fs from 'fs-extra'
const localesListFile = process.cwd() + '/src/locales/scripts/locales-list.json'
const localesList = fs.readJsonSync(localesListFile)

const getValidatedLocales = () => {
  return Object.values(localesList)
    .map((locale) => ({
      code: locale.slug,
      name: locale.english_name,
      iso: locale.lang_code_iso_639_1,
      wpLocale: locale.wp_locale,
      dir: locale.text_direction,
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
