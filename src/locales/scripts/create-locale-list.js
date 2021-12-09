/**
This script extracts data for locales available in GlotPress and translate.wp.org,
 and saves it to `locales-list.json`
 **/

const axios = require('axios')
const fs = require('fs')
const { fetchTranslationStatus } = require('./get-translations-status.js')

const base_url =
  'https://raw.githubusercontent.com/GlotPress/GlotPress-WP/develop/locales/locales.php'

const locales = {}

async function getGpLocalesData() {
  const res = await axios.get(base_url)
  return res.data
}

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    )

async function getLocaleData() {
  const data = await getGpLocalesData()
  const rawLocalesData = data
    .split('new GP_Locale();')
    .splice(1)
    .map((item) => item.trim())
  const properties = [
    'english_name',
    'native_name',
    'lang_code_iso_639_1',
    'lang_code_iso_639_2',
    'country_code',
    'slug',
    'nplurals',
    'plural_expression',
    'google_code',
    'facebook_locale',
    'text_direction',
    'wp_locale',
  ]
  const propertyRePatterns = {}
  properties.forEach((prop) => {
    propertyRePatterns[prop] = new RegExp(`${prop} *= *['](.*)['];`)
  })
  const wpLocalePattern = /wp_locale *= *'(.*)';/

  rawLocalesData.forEach((rawData) => {
    const wpLocaleMatch = rawData.match(wpLocalePattern)
    // ugly check to exclude English from the locales list, so we don't overwrite `en.json` later.
    if (wpLocaleMatch && wpLocaleMatch[1] !== 'en_US') {
      const wpLocale = wpLocaleMatch[1]
      locales[wpLocale] = {}
      Object.keys(propertyRePatterns).forEach((key) => {
        const pattern = propertyRePatterns[key]
        const value = rawData.match(pattern)
        if (value) {
          const camelCasedPropName = snakeToCamel(
            key === 'english_name' ? 'name' : key
          )
          locales[wpLocale][camelCasedPropName] = value[1]
        }
      })
    }
  })
  return await fetchTranslationStatus(locales)
}

getLocaleData()
  .then((data) => {
    console.log('data we got', data)
    try {
      const fileName = process.cwd() + '/src/locales/scripts/locales-list.json'
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2) + '\n')
      console.log(`Successfully wrote locales list file to ${fileName}`)
    } catch (err) {
      console.error(err)
    }
  })
  .catch((err) => console.log('Could not fetch data from ', base_url, err))
