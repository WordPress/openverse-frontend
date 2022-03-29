/**
This script extracts data for locales available in GlotPress and translate.wp.org,
 transforms some locale properties to match what Vue i18n expects,
 and saves it to `wp-locales-list.json`.
 **/

const fs = require('fs')

const axios = require('axios')

const { addFetchedTranslationStatus } = require('./get-translations-status')

const base_url =
  'https://raw.githubusercontent.com/GlotPress/GlotPress-WP/develop/locales/locales.php'

/**
 * Fetches the data from GlotPress GitHub.
 * @returns {Promise<any>}
 */
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

const createPropertyRePatterns = ({
  properties = [
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
  ],
} = {}) => {
  const propertyRePatterns = {}
  properties.forEach((prop) => {
    propertyRePatterns[prop] = new RegExp(`${prop} *= *['](.*)['];`)
  })
  return propertyRePatterns
}

function parseLocaleData(rawData) {
  const wpLocalePattern = /wp_locale *= *'(.*)';/
  const propertyRePatterns = createPropertyRePatterns()
  const wpLocaleMatch = rawData.match(wpLocalePattern)
  // ugly check to exclude English from the locales list,
  // so we don't overwrite `en.json` later.
  if (wpLocaleMatch && wpLocaleMatch[1] !== 'en_US') {
    const wpLocale = wpLocaleMatch[1]
    const data = {}
    Object.keys(propertyRePatterns).forEach((key) => {
      const pattern = propertyRePatterns[key]
      const value = rawData.match(pattern)
      if (value) {
        // Convert locale property names to camelCase and replace `english_name` with `name`
        const camelCasedPropName = snakeToCamel(
          key === 'english_name' ? 'name' : key
        )
        data[camelCasedPropName] = value[1]
      }
    })
    return {
      wpLocale: wpLocale,
      data,
    }
  }
}

/**
 * Fetches locale data from the GP GitHub.
 * Extracts properties and converts locale property names to camelCase as expected
 * by Vue i18n.
 * Fetches data from translate.wordpress.org, leaves only the locales available
 * there, and adds `code` and `translated` properties to each locale.
 * @returns {Promise<{}>}
 */
async function getWpLocaleData() {
  const locales = {}

  const data = await getGpLocalesData()
  const rawLocalesData = data
    .split('new GP_Locale();')
    .splice(1)
    .map((item) => item.trim())

  rawLocalesData.forEach((rawData) => {
    const localeData = parseLocaleData(rawData)
    if (localeData) {
      locales[localeData.wpLocale] = localeData.data
    }
  })
  const unsortedLocales = await addFetchedTranslationStatus(locales)
  return Object.keys(unsortedLocales)
    .sort()
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue] = unsortedLocales[currentValue]
      return accumulator
    }, {})
}

getWpLocaleData()
  .then((data) => {
    try {
      const fileName = process.cwd() + '/src/locales/scripts/wp-locales.json'
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2) + '\n')
      console.log(`Successfully wrote locales list file to ${fileName}`)
    } catch (err) {
      console.error(err)
    }
  })
  .catch((err) => console.log('Could not fetch data from ', base_url, err))
