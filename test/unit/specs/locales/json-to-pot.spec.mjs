import {
  potTime,
  replaceVarsPlaceholders,
} from '~/locales/scripts/json-to-pot.mjs'

import clonedeep from 'lodash.clonedeep'
import { getKeyValue } from '~/locales/scripts/json-helpers.mjs'

describe('replaceVarsPlaceholders', () => {
  it('replaces lower case placeholders', () => {
    const string = 'string with a {placeholder}'
    const expected = 'string with a ###placeholder###'

    expect(replaceVarsPlaceholders(string)).toEqual(expected)
  })
  /**
   * Replaces placeholders no matter what casing they use
   */
  it('replaces upper case placeholders', () => {
    const string = '{strinG} {WITH} {Placeholders}'
    const expected = '###strinG### ###WITH### ###Placeholders###'

    expect(replaceVarsPlaceholders(string)).toEqual(expected)
  })
  /**
   * Replaces lower- and upper- case placeholders with one or more
   * dashes anywhere in the string
   */
  it('replaces placeholders with dashes', () => {
    const string = '{a-string-and-a-half} {WITH--} {Place-holders}'
    const expected =
      '###a-string-and-a-half### ###WITH--### ###Place-holders###'

    expect(replaceVarsPlaceholders(string)).toEqual(expected)
  })
  /**
   * Does not replace placeholders with anything other than letters and dashes,
   * or ### placeholders
   */
  it('returns the string if no placeholders are found', () => {
    const string =
      '{some{ ###phrase### that {does--not {have.any} {place_holders}'
    const expected =
      '{some{ ###phrase### that {does--not {have.any} {place_holders}'

    expect(replaceVarsPlaceholders(string)).toEqual(expected)
  })
})

const sample_json = {
  hero: {
    level2: {
      brand: 'Openverse',
      level3: {
        subtitle: 'Browse over 500 million images, available for reuse',
        brand: 'Openverse',
      },
    },
    // search: {
    //   button: 'Search',
    // },
  },
  'browse-page': {
    'search-form': {
      placeholder: 'Search all {type}',
      image: 'images',
      all: 'content',
      'collection-placeholder': 'Search this collection',
      button: 'Search',
    },
  },
}
const expected_pot = `

msgctxt "hero.brand"
msgid "Openverse"
msgstr ""

#: src/components/HeroSection.vue:9
msgctxt "hero.subtitle"
msgid "Browse over 500 million images, available for reuse"
msgstr ""

#: src/components/HeroSection.vue:32
msgctxt "hero.search.button"
msgid "Search"
msgstr ""

#. Do not translate words between ### ###.
#: src/components/SearchGridForm.vue:81
msgctxt "browse-page.search-form.placeholder"
msgid "Search all ###type###"
msgstr ""

#: src/components/ImageGrid/ImageGrid.vue:64
msgctxt "browse-page.search-form.image"
msgid "images"
msgstr ""

msgctxt "browse-page.search-form.all"
msgid "content"
msgstr ""

msgctxt "browse-page.search-form.collection-placeholder"
msgid "Search this collection"
msgstr ""

#: src/components/HeroSection.vue:32
msgctxt "hero.search.button"
msgid "Search"
msgstr ""`

describe('potTime', () => {
  it('converts all keys', () => {
    const actualPot = potTime(sample_json)
    expect(actualPot).toEqual(expected_pot)
    expect(actualPot.split('msgid').length - 1).toEqual(8)
  })
})

describe('getAllPaths', () => {
  it('gets all paths', () => {
    const ob = clonedeep(sample_json)
    const actualPot = potTime(ob)
    expect(actualPot).toEqual([
      'browse-page.search-form.placeholder',
      'browse-page.search-form.image',
      'browse-page.search-form.all',
      'browse-page.search-form.collection-placeholder',
      'browse-page.search-form.button',
      'hero.level2.brand',
      'hero.level2.level3.subtitle',
      'hero.level2.level3.brand',
    ])
    actualPaths.forEach((path) => {
      const val = getKeyValue(path, ob)
      console.log(path, val)
    })
  })
})
