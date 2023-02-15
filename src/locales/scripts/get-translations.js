/**
 * Fetch the NGX-Translate JSON file for each supported language,
 * convert to our JSON format, and save in the correct folder.
 */
const { writeFile } = require("fs/promises")
const { writeFileSync, createWriteStream } = require("fs")
const os = require("os")

const chokidar = require("chokidar")
const qs = require("qs")
const AdmZip = require("adm-zip")

const axios = require("./axios")

const jed1xJsonToJson = require("./jed1x-json-to-json")
const { parseJson } = require("./read-i18n")

/**
 *
 * @typedef {"json"|"jed1x"|"ngx"} JSONFormat
 * @returns
 */

/**
 * A GlotPress Output format for translation strings
 * @typedef {("android"|"po"|"mo"|"resx"|"strings"|"properties"|"json"|"jed1x"|"ngx" & JSONFormat)} Format
 */

const baseUrl = "https://translate.wordpress.org/projects/meta/openverse"
const bulkBaseUrl = "https://translate.wordpress.org/exporter/meta/openverse"
const loginUrl = "https://login.wordpress.org/wp-login.php"

/**
 *
 * @param {Format} format
 * @returns {(localeCode: string) => string}
 */
const makeTranslationUrl =
  (format = "po") =>
  (localeCode = "en-gb") =>
    `${baseUrl}/${localeCode}/default/export-translations/?format=${format}`

/**
 * fetch a json translation from GlotPress
 * @param {string} locale
 */
const fetchJed1xTranslation = (locale) =>
  axios
    .get(makeTranslationUrl("jed1x")(locale))
    .then((res) => res.data)
    .catch((err) => err.response.status)

const replacePlaceholders = (json) => {
  if (json === null) {
    return null
  }
  if (typeof json === "string") {
    return json.replace(/###([a-zA-Z-]*)###/g, "{$1}")
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
const fetchAndConvertJed1xTranslations = (locales) => {
  return Promise.allSettled(locales.map(fetchJed1xTranslation))
    .then((res) => {
      let successfulTranslations = []
      let failedTranslations = []
      res.forEach(({ status, value }, index) => {
        if (status === "fulfilled" && !isEmpty(value)) {
          successfulTranslations[locales[index]] = value
        } else {
          failedTranslations.push(`${locales[index]} (${value})`)
        }
      })
      if (failedTranslations.length) {
        console.log(`Failed to fetch ${failedTranslations.join(", ")}`)
      }
      return successfulTranslations
    })
    .then((res) => {
      Object.keys(res).forEach((key) => {
        res[key] = jed1xJsonToJson(res[key])
      })
      return res
    })
    .then(writeLocaleFiles)
}

/**
 * Get the URL to download a ZIP file containing all translation strings for all
 * locales in the specified format.
 *
 * @param {Format} format - the
 * @return {string}
 */
const makeBulkTranslationUrl = (format = "po") =>
  `${bulkBaseUrl}/-do/?export-format=${format}`

/**
 * Fetch the ZIP of translations strings from GlotPress using the authentication
 * cookies to access the page.
 *
 * @param cookies {string[]} - the cookies to authenticate the ZIP download
 * @return {Promise<string>}} - the path to the downloaded ZIP file
 */
const fetchBulkJed1xTranslations = (cookies) =>
  axios
    .get(makeBulkTranslationUrl("jed1x"), {
      headers: { cookie: cookies.join("; ") },
      responseType: "stream",
    })
    .then((res) => {
      return new Promise((resolve, reject) => {
        const dest = process.cwd() + "/src/locales/openverse.zip"
        const writer = createWriteStream(dest)
        res.data.pipe(writer)
        writer.on("error", reject)
        writer.on("close", () => {
          resolve(dest)
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })

/**
 * Given a username and password, login to WordPress and get the authentication
 * cookies from the `Set-Cookie` header.
 *
 * @param log {string} - the username to log in with
 * @param pwd {string} - the password for the given username
 * @return {Promise<string[]>} - the list of cookies in the `Set-Cookie` header
 */
const getAuthCookies = (log, pwd) =>
  axios
    .post(
      loginUrl,
      qs.stringify({
        log,
        pwd,
        rememberme: "forever",
        "wp-submit": "Log In",
        redirect_to: "https://make.wordpress.org/",
      }),
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        maxRedirects: 0,
        validateStatus: (status) => status === 302, // successful login results in redirect
      }
    )
    .then((res) =>
      res.headers["set-cookie"].map((cookie) =>
        cookie.substring(0, cookie.indexOf(";"))
      )
    )

/**
 * Extract all JSON file from the given ZIP file. Their names are sanitised to
 * be in the format `<locale_code>.json`.
 *
 * @param zipPath {string} - the path to the ZIP file to extract
 * @return {Promise<number>} - the number of locales successfully downloaded
 */
const extractZip = (zipPath) => {
  const zip = new AdmZip(zipPath)
  return Promise.all(
    zip
      .getEntries()
      .filter((entry) => entry.entryName.endsWith(".json"))
      .map((entry) => {
        const jed1x = JSON.parse(zip.readAsText(entry))
        const locale = entry.name
          .replace("meta-openverse-", "")
          .replace(".jed.json", "")
        return [locale, jed1xJsonToJson(jed1x)]
      })
      .map((args) => writeLocaleFile(...args))
  )
}

/**
 * Write `en.json` from `en.json5`.
 */
const writeEnglish = () => {
  const rootEntry = parseJson("en.json5")
  writeFileSync(
    process.cwd() + "/src/locales/en.json",
    JSON.stringify(rootEntry, null, 2) + os.EOL
  )
  console.log("Successfully saved English translation to en.json.")
}

writeEnglish()
if (process.argv.includes("--watch")) {
  console.log("Watching en.json5 for changes...")
  chokidar
    .watch(process.cwd() + "/src/locales/scripts/en.json5")
    .on("all", (event, path) => {
      console.log(`Event '${event}' for file ${path}`)
      writeEnglish()
    })
}

if (!process.argv.includes("--en-only")) {
  const username = process.env.GLOTPRESS_USERNAME
  const password = process.env.GLOTPRESS_PASSWORD
  if (username && password) {
    console.log("Auth credentials found, performing bulk download.")

    getAuthCookies(username, password)
      .then(fetchBulkJed1xTranslations)
      .then(extractZip)
      .then((res) => {
        console.log(`Successfully saved ${res.length + 1} translations.`)
      })
      .catch(console.error)
  } else {
    console.log("Auth credentials not found, performing parallel download.")

    const localeJSON = require("./wp-locales.json")
    fetchAndConvertJed1xTranslations(
      Object.values(localeJSON).map((i) => i.slug)
    )
      .then((res) => {
        console.log(`Successfully saved ${res.length + 1} translations.`)
      })
      .catch(console.error)
  }
}
