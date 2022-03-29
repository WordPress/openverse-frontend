export const CC_LICENSES = [
  'by',
  'by-sa',
  'by-nd',
  'by-nc',
  'by-nc-sa',
  'by-nc-nd',
] as const

export const DEPRECATED_CC_LICENSES = ['nc-sampling+', 'sampling+'] as const

export const PUBLIC_DOMAIN_MARKS = ['pdm', 'cc0'] as const

export const ACTIVE_LICENSES = [...PUBLIC_DOMAIN_MARKS, ...CC_LICENSES] as const

export const ALL_LICENSES = [
  ...ACTIVE_LICENSES,
  ...DEPRECATED_CC_LICENSES,
] as const

export type License = typeof ALL_LICENSES[number]

export const LICENSE_VERSIONS = ['', '1.0', '2.0', '2.5', '3.0', '4.0'] as const

export type LicenseVersion = typeof LICENSE_VERSIONS[number]
