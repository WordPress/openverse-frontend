/**
 * Fetch the NGX-Translate JSON file for each supported language,
 * convert to our JSON format, and save in the correct folder.
 */

const { writeFileSync } = require("fs")
const os = require("os")

const chokidar = require("chokidar")

const { parseJson } = require("./read-i18n")

const bulkDownload = require("./bulk-download")
const separateDownload = require("./separate-download")

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
  bulkDownload()
    .catch((err) => {
      console.error(err)
      return separateDownload()
    })
    .catch((err) => {
      console.error(err)
      console.error(":'-( Downloading translations failed.")
      if (process.argv.includes("--require-complete")) {
        process.exitCode = 1
      }
    })
}
