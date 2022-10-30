/**
 * In `en.json` we use a limited version of JSON5. It is valid JSON5 but only
 * uses a limited set of features and syntax. This package provides functions
 * to read this format and convert it into regular JSON.
 *
 * - Keys must be always be double-quoted for consistency with hyphenated keys
 *   that need quotes.
 * - All values must be strings. This is okay because we're only dealing with
 *   i18n translation files.
 * - Only single line `// ...` comments are allowed. These comments describe the
 *   content that follows it. Inline comments are not allowed.
 *
 * ```json5
 * {
 *   // documentation about `key-a`
 *   "key-a": "value-a",
 *   "key-b": {
 *     "key-c": "value-c",
 *   },
 * }
 * ```
 *
 * @typedef {{ [key: string]: string | SimJson }} SimJson
 */

const fs = require('fs')
const path = require('path')

/**
 * An `Entry` refers to one i18n translation definition. It can be one of two
 * types: string-string. where the value of the key is one string, or
 * string-object, where the key contains other nested key value pairs.
 *
 * ```json5
 * {
 *   "key-a": "value-a",   // string-string type
 *   "key-b": {            // string-object type
 *     "key-c": "value-c",
 *   },
 * }
 * ```
 */
class Entry {
  /**
   * Create a new `Entry` instance with the given key, value and comment.
   *
   * @param key {string} the key of the mapping
   * @param value {string | undefined} the value of the mapping, only applies for string-string type
   * @param comment {string | undefined} the documentation comment, if any
   */
  constructor(key, value = undefined, comment = undefined) {
    this.key = key // set to '' for the JSON top-level object
    this.value = value // populated for string-string entries, `undefined` otherwise
    this.doc = comment

    this.children = [] // populated for string-object entries, `[]` otherwise
    this.ancestors = []
  }

  /**
   * Get the fully qualified name of the instance w.r.t. the root `Entry`.
   *
   * @return {string} the dot separated path to this entry
   */
  get lineage() {
    return [...this.ancestors.filter((item) => item), this.key].join('.')
  }

  /**
   * Register the given entry as a child of this one. Adds this entry and its
   * ancestors to the child's ancestry.
   *
   * @param child {Entry} the child to register
   */
  addChild(child) {
    child.ancestors.push(...this.ancestors, this.key)
    this.children.push(child)
  }

  /**
   * Get the JSON representation of this entry and all its children. This
   * conversion loses information present in comments.
   *
   * @return {SimJson} a POJSO containing the translation mappings
   */
  toJSON() {
    // This is a string-string entry, will be handled by parent.
    if (this.value) return {}

    /** @type {SimJson} */
    const pojo = {}
    for (const child of this.children) {
      if (child.value) pojo[child.key] = child.value
      else pojo[child.key] = child.toJSON()
    }
    return pojo
  }
}

/**
 * Read the given file into a list of lines.
 *
 * @param filename {string} the name of the JSON file to read
 * @return {string[]} the lines read from the file
 */
const readLinesFromFile = (filename) =>
  fs.readFileSync(path.join(__dirname, filename), 'utf-8').split('\n')

/**
 * Parse the given lines of JSON into a tree of `Entry` instances.
 *
 * @param lines {string[]} the lines read from the JSON file
 * @return {Entry} the root `Entry` instance for the top-level JSON object
 */
const parseJsonLines = (lines) => {
  /** @type {Entry[]} */
  const stack = []
  /** @type {string | undefined} */
  let comment = undefined

  for (let line of lines) {
    line = line.trim().replace(/,$/, '')

    let match = null
    if ((match = line.match(/\/\/\s(?<text>.+)/))) {
      // comment
      comment = match.groups?.text
    } else if (line === '{') {
      // start of JSON file
      const entry = new Entry('')
      stack.push(entry)
      if (comment) comment = undefined
    } else if ((match = line.match(/^'?(?<key>[\w-]+)'?: \{/))) {
      // start of string-object type mapping
      const key = match.groups?.key ?? '?'
      const entry = new Entry(key, undefined, comment)
      stack.push(entry)
      if (comment) comment = undefined
    } else if (line === '}') {
      // end of string-object type mapping or end of JSON file
      const entry = stack.pop()
      if (!entry) throw 'Encountered unmatched closing brace'
      if (entry.key === '') return entry
      stack[stack.length - 1].addChild(entry)
    } else if (
      (match = line.match(/^'?(?<key>[\w-]+)'?:\s["'](?<value>[^"']+)["']/))
    ) {
      // string-string type mapping
      const key = match.groups?.key ?? ''
      const value = match.groups?.value ?? ''
      const entry = new Entry(key, value, comment)
      if (comment) comment = undefined
      stack[stack.length - 1].addChild(entry)
    }
  }
  throw 'Reached EOF without closure'
}

/**
 * Parse the given filename into a tree of `Entry` instances.
 * @param filename {string} the name of the JSON file to read
 * @return {Entry} the root `Entry` instance for the top-level JSON object
 */
const parseJson = (filename) => parseJsonLines(readLinesFromFile(filename))

module.exports = { Entry, parseJson }
