/**
 * Fetch the list of locales that are available on translate.wordpress.org
 * and the translation status for all of them.
 */
const { writeFile } = require('fs/promises')
const os = require('os')
const axios = require('axios')
const parser = require('node-html-parser')

const baseUrl = `https://translate.wordpress.org/projects/meta/openverse`
const localesList = require('./locales-list.json')
const locales = Object.values(localesList)

/**
 * fetch a json translation from translate.wordpress.org
 */
const fetchTranslationStatusPage = async () => {
  const localesData = []
  const raw = await axios.get(baseUrl)
  const parsed = parser.parse(raw.data)
  parsed
    .querySelector('tbody')
    .querySelectorAll('tr')
    .forEach((row) => {
      const cells = row.querySelectorAll('td')
      const langLink = cells[0].querySelector('a')
      const langName = langLink.text.trim()
      const langObject = locales.find((locale) => {
        return locale.englishName === langName
      })
      if (langObject) {
        const percentTranslated = parseInt(
          cells[1].text.trim().replace('%', ''),
          10
        )
        let name = langObject.englishName
        delete langObject.englishName
        langObject.code = langObject.slug
        localesData.push({ name, ...langObject, translated: percentTranslated })
      }
    })
  return localesData
}

fetchTranslationStatusPage().then((r) => {
  writeFile(
    process.cwd() + `/src/locales/scripts/translated.json`,
    JSON.stringify(r, null, 2) + os.EOL
  )
})
