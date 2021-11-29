/**
 * Fetch the NGX-Translate JSON file for each supported language,
 * convert to our JSON format, and save in the correct folder.
 */
const { writeFile } = require('fs/promises')
const os = require('os')
const axios = require('axios')
const parser = require('node-html-parser')

const baseUrl = `https://translate.wordpress.org/projects/meta/openverse`
const locales = require('./valid-locales.json')
/**
 * fetch a json translation from GlotPress
 */
const fetchTranslationStatusPage = async () => {
  const localesData = []
  const raw = await axios.get(baseUrl)
  const parsed = parser.parse(raw.data)
  parsed
    .querySelector('tbody')
    .querySelectorAll('tr')
    .forEach((row, idx) => {
      const cells = row.querySelectorAll('td')
      const langName = cells[0].querySelector('a').text.trim()
      const langObject = locales.find((locale) => {
        // console.log(locale.name, langName)
        return locale.name === langName
      })
      if (langObject) {
        console.log(idx, 'row:')
        console.log('object: ', langName, langObject)
        const percentTranslated = parseInt(
          cells[1].text.trim().replace('%', ''),
          10
        )
        localesData.push({ ...langObject, translated: percentTranslated })
      }
    })
  return localesData
}

fetchTranslationStatusPage().then((r) => {
  console.log(r)

  writeFile(
    process.cwd() + `/src/locales/scripts/translated.json`,
    JSON.stringify(r, null, 2) + os.EOL
  )
})
