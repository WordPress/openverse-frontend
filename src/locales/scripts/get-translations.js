/**
 * Fetch the NGX-Translate JSON file for each supported language,
 * convert to our JSON format, and save in the correct folder.
 */
const { writeFile } = require('fs/promises')
const os = require('os')
const axios = require('axios')
const JSSoup = require('jssoup').default
const ngxJsonToJson = require('./ngx-json-to-json')

/**
 *
 * @typedef {"json"|"jed1x"|"ngx"} JSONFormat
 * @returns
 */

/**
 * A GlotPress Output format for translation strings
 * @typedef {("android"|"po"|"mo"|"resx"|"strings"|"properties"|"json"|"jed1x"|"ngx" & JSONFormat)} Format
 */

const baseUrl = `https://translate.wordpress.org/projects/meta/openverse`

/**
 *
 * @param {Format} format
 * @returns {(localeCode: string) => string}
 */
const makeTranslationUrl = (format = 'po') => (localeCode = 'en-gb') =>
  `${baseUrl}/${localeCode}/default/export-translations/?format=${format}`

/**
 * fetch a json translation from GlotPress
 * @param {string} locale
 */
const fetchNgxTranslation = (locale) =>
  axios.get(makeTranslationUrl('ngx')(locale)).then((res) => res.data)

const replacePlaceholders = (json) => {
  if (json === null) {
    return null
  }
  if (typeof json === 'string') {
    return json.replace(/###([a-zA-Z-]*)###/, '{$1}')
  }
  let currentJson = { ...json }

  for (const row of Object.entries(currentJson)) {
    let [key, value] = row
    currentJson[key] = replacePlaceholders(value)
  }
  return currentJson
}
/**
 * Write translation strings to a file in the locale directory
 * @param {string} locale
 * @param {any} rawTranslations
 */
const writeLocaleFile = (locale, rawTranslations) => {
  const translations = replacePlaceholders(rawTranslations)
  return writeFile(
    process.cwd() + `/src/locales/${locale}.json`,
    JSON.stringify(translations, null, 2) + os.EOL
  )
}

/**
 * Write a file for each translation object
 * @param {{[locale: string]: {[translation: string]: string}}} translationsByLocale
 */
const writeLocaleFiles = (translationsByLocale) =>
  Promise.all(
    Object.entries(translationsByLocale).map(([locale, translations]) =>
      writeLocaleFile(locale, translations)
    )
  )

// Check if an object is empty
const isEmpty = (obj) => Object.values(obj).every((x) => x === null)

/**
 * Write translation files to the "src/locales" directory from
 * the supplied list of locales
 *
 * @param {string[]} locales
 */
const fetchAndConvertNGXTranslations = (locales) => {
  return Promise.allSettled(locales.map(fetchNgxTranslation))
    .then((res) => {
      let successfulTranslations = []
      res.forEach(({ status, value }, index) => {
        if (status === 'fulfilled' && !isEmpty(value)) {
          successfulTranslations[locales[index]] = value
        }
      })
      return successfulTranslations
    })
    .then((res) => {
      Object.keys(res).forEach((key) => {
        res[key] = ngxJsonToJson(res[key])
      })
      return res
    })
    .then(writeLocaleFiles)
}

const MIN_TRANSLATED = 70 // translation threshold after which we download
const fetchTranslatedLocalesList = () =>
  axios.get(baseUrl).then((res) => {
    const soup = new JSSoup(res.data)
    const rows = soup.find('tbody').findAll('tr')
    return rows
      .map((row) => {
        const cells = row.findAll('td').splice(0, 2)
        //  href is like /projects/meta/openverse/es-ve/default/
        const languageSlug = cells[0].find('a').attrs.href.split('/')[4]
        const translatedPercentage = parseInt(
          cells[1].text.replace('%', '').trim()
        )
        return { languageSlug, translatedPercentage }
      })
      .filter((row) => {
        return row.translatedPercentage > MIN_TRANSLATED
      })
      .map((row) => {
        return row.languageSlug
      })
  })

fetchTranslatedLocalesList().then((translatedLocales) => {
  fetchAndConvertNGXTranslations(translatedLocales)
    .then((res) => {
      console.log(`Successfully saved ${res.length} translations.`)
    })
    .catch(console.error)
})
