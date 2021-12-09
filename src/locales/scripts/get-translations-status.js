/**
 * Fetch the list of locales that are available on translate.wordpress.org
 * and the translation status for all of them.
 */
const axios = require('axios')
const parser = require('node-html-parser')

const baseUrl = `https://translate.wordpress.org/projects/meta/openverse`

/**
 * fetch a list of locales available at translate.wordpress.org,
 * and the translation status for them.
 */
const fetchTranslationStatus = async (gpLocales) => {
  const locales = Object.values(gpLocales)

  const localesData = {}
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
        return locale.name === langName
      })
      if (langObject) {
        const percentTranslated = parseInt(
          cells[1].text.trim().replace('%', ''),
          10
        )
        langObject.code = langObject.slug
        localesData[langObject.wpLocale] = {
          ...langObject,
          translated: percentTranslated,
        }
      }
    })
  return localesData
}

module.exports = { fetchTranslationStatus }
