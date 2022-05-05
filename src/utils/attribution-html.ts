import type { Media } from '~/models/media'
import {
  getElements,
  getFullLicenseName,
  isPublicDomain,
} from '~/utils/license'
import type { LicenseElement } from '~/constants/license'

import enJson from '~/locales/en.json'

import type VueI18n from 'vue-i18n'

/* Helper functions */

/**
 * Create an HTML tag with the given name, attributes and children.
 *
 * @param name - the tag name
 * @param attrs - the attributes associated with the tag
 * @param children - the tags children
 * @returns the HTML markup of the tag
 */
const h = (
  name: string,
  attrs: Record<string, string>,
  children: string[] | null = null
): string => {
  const map = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')
  const opening = map ? `<${name} ${map}>` : `<${name}>`
  const closing = `</${name}>`
  return `${opening}${(children ?? []).join('\n')}${closing}`
}

/**
 * Format the given string by replacing all placeholder keys with their values.
 * The pairs of placeholders and values are passed as a dictionary.
 *
 * @param text - the string in which to perform the formatting
 * @param replacements - the mapping of placeholders to values
 * @returns the formatted string
 */
const fmt = (text: string, replacements: Record<string, string>): string => {
  Object.entries(replacements).forEach(([key, value]) => {
    text = text.replace(`{${key}}`, value)
  })
  return text
}

/**
 * Perform the same role as `i18n.t` except that it's restricted to reading
 * English from `en.json`.
 *
 * @param path - the key to the JSON value to read
 * @param replacements - the pair of placeholders and their replacement strings
 * @returns the English string with placeholders substituted
 */
const fakeT = (
  path: string,
  replacements: Record<string, string> = {}
): string => {
  interface NestedRecord {
    [key: string]: string | NestedRecord
  }

  const segments = path.split('.')
  let fraction: NestedRecord = enJson
  let text: string | undefined = undefined
  segments.forEach((segment) => {
    const piece = fraction[segment]
    if (typeof piece === 'string') text = piece
    else fraction = piece
  })
  return text ? fmt(text, replacements) : ''
}

/**
 * Get an `<img>` tag corresponding to a license element.
 *
 * @param licenseElement - the license element for which to get the `<img>` tag
 * @returns the HTML markup of the `<img>` tag
 */
const licenseElementImg = (licenseElement: LicenseElement): string => {
  const filename = licenseElement.replace('-', '.')
  const src = `https://mirrors.creativecommons.org/presskit/icons/${filename}.svg`
  return h('img', {
    src,
    style: 'height: 1em; margin-right: 0.125em; display: inline;',
  })
}

/**
 * Get an HTML `<a>` tag set up with the `target` and `rel` attributes.
 *
 * @param href - the link that the anchor tag should point to
 * @param text - the textual content of the anchor tag
 * @returns the HTML markup of the `<a>` tag
 */
const extLink = (href: string, text: string) =>
  h('a', { target: '_blank', rel: 'noopener noreferrer', href }, [text])

/* Interfaces */

/**
 * This interface describes a subset of media that contains fields necessary
 * for generating a proper attribution.
 */
export type AttributableMedia = Pick<
  Media,
  | 'title'
  | 'foreign_landing_url'
  | 'creator'
  | 'creator_url'
  | 'license'
  | 'license_version'
  | 'license_url'
>

/**
 * This interface describes the options that the `getAttribution` function can
 * take to customise its output.
 */
export interface AttributionOptions {
  includeIcons?: boolean
  isPlaintext?: boolean
}

/* Actual util */

/**
 * Get the HTML markup for properly attributing the given media item.
 *
 * @param mediaItem - the media item being attributed
 * @param i18n - the i18n instance to access translations
 * @param includePreview - whether to include the preview markup in the HTML
 * @returns the HTML markup of the attribution
 */
export const getAttribution = (
  mediaItem: AttributableMedia,
  i18n: VueI18n | null = null,
  { includeIcons, isPlaintext }: AttributionOptions = {
    isPlaintext: false,
    includeIcons: true,
  }
): string => {
  if (!mediaItem) return ''

  /* Title */

  let titleLink = mediaItem.title || ''
  if (!isPlaintext && mediaItem.foreign_landing_url && titleLink)
    titleLink = extLink(mediaItem.foreign_landing_url, titleLink)

  /* Creator */

  let creatorLink = mediaItem.creator || ''
  if (!isPlaintext && mediaItem.creator_url && creatorLink)
    creatorLink = extLink(mediaItem.creator_url, creatorLink)

  /* License */

  const fullLicenseName = getFullLicenseName(
    mediaItem.license,
    mediaItem.license_version,
    i18n
  )
  let licenseIcons = ''
  if (includeIcons && mediaItem.license) {
    const elements = getElements(mediaItem.license)
    const icons = elements.map((element) => licenseElementImg(element))
    // Icons are only rendered if present for every element
    if (!icons.includes('')) {
      licenseIcons = icons.join('')
    }
  }

  let licenseLink = `${fullLicenseName} ${licenseIcons}`.trim()
  if (!isPlaintext && mediaItem.license_url) {
    licenseLink = extLink(`${mediaItem.license_url}?ref=openverse`, licenseLink)
  }

  /* Attribution */

  const i18nBase = 'media-details.reuse.credit'
  const isPd = isPublicDomain(mediaItem.license)

  let attribution: string

  const tFn = i18n
    ? (key: string, values?: VueI18n.Values) => i18n.t(key, values).toString()
    : fakeT

  const fillers: Record<string, string> = {
    title: titleLink
      ? tFn(`${i18nBase}.actual-title`, { title: titleLink })
      : tFn(`${i18nBase}.generic-title`),
    'marked-licensed': tFn(`${i18nBase}.${isPd ? 'marked' : 'licensed'}`),
    license: licenseLink,
    'view-legal': '',
    creator: '',
  }

  if (isPlaintext && mediaItem.license_url) {
    fillers['view-legal'] = tFn(`${i18nBase}.view-legal-text`, {
      'terms-copy': tFn(`${i18nBase}.${isPd ? 'terms-text' : 'copy-text'}`),
      url: `${mediaItem.license_url}?ref=openverse`,
    })
  }

  if (creatorLink) {
    fillers.creator = tFn(`${i18nBase}.creator-text`, {
      'creator-name': creatorLink,
    })
  }

  attribution = tFn(`${i18nBase}.text`, fillers)
  attribution = attribution.replace(/\s{2}/g, ' ')

  return isPlaintext
    ? attribution
    : h('p', { class: 'attribution' }, [attribution])
}
