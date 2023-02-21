const { writeFile } = require("fs/promises")
const os = require("os")

/**
 * Mutates an object at the path with the value. If the path
 * does not exist, it is created by nesting objects along the
 * path segments.
 *
 * @see {@link https://stackoverflow.com/a/20240290|Stack Overflow}
 *
 * @param {any} obj - The object to mutate.
 * @param {string} path - The dot delimited path on the object to mutate.
 * @param {unknown} value - The value to set at the path.
 */
exports.setToValue = function setValue(obj, path, value) {
  var a = path.split(".")
  var o = obj
  while (a.length - 1) {
    var n = a.shift()
    if (!(n in o)) o[n] = {}
    o = o[n]
  }
  o[a[0]] = value
}

/**
 * Replace ###<text>### with {<text>}.
 *
 * @param json {any} - the JSON object to replace placeholders in
 * @return {any} the sanitised JSON object
 */
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

exports.replacePlaceholders = replacePlaceholders

/**
 * Write translation strings to a file in the locale directory
 * @param {string} locale
 * @param {any} rawTranslations
 */
exports.writeLocaleFile = (locale, rawTranslations) => {
  const translations = replacePlaceholders(rawTranslations)
  return writeFile(
    process.cwd() + `/src/locales/${locale}.json`,
    JSON.stringify(translations, null, 2) + os.EOL
  )
}
