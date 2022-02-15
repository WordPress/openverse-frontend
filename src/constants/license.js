export const CC_LICENSES = /** @type {const} */ ([
  'by',
  'by-sa',
  'by-nd',
  'by-nc',
  'by-nc-sa',
  'by-nc-nd',
])

/**
 * @template T
 * @typedef {T extends `${infer P}-${infer PP}-${infer PPP}` ? [P, PP, PPP] : T extends `${infer P}-${infer PP}` ? [P, PP] : [T]} PartitionLicense
 */

/** @typedef {PartitionLicense<CCLicense>[number]} LicensePart */

/** @typedef {typeof CC_LICENSES[number]} CCLicense */

export const NON_CC_LICENSES = /** @type {const} */ (['cc0', 'pdm'])

/** @typedef {typeof NON_CC_LICENSES[number]} NonCCLicense */

export const DEPRECATED_LICENSES = /** @type {const} */ ([
  'nc-sampling+',
  'sampling+',
])

/** @typedef {typeof DEPRECATED_LICENSES[number]} DeprecatedLicense */

export const ALL_LICENSES = [
  ...CC_LICENSES,
  ...NON_CC_LICENSES,
  ...DEPRECATED_LICENSES,
]

/** @typedef {typeof ALL_LICENSES[number]} License */

export const MARKS = /** @type {const} */ (['cc0', 'pdm'])

/** @typedef {typeof MARKS[number]} Mark */

/** @type {Record<LicensePart | Mark, string>} */
export const LICENSE_ICON_MAPPING = {
  by: 'by',
  nc: 'nc',
  nd: 'nd',
  sa: 'sa',
  cc0: 'cc0',
  pdm: 'pdm',
}
