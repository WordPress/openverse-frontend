import type {
  License,
  LicenseVersion,
  LicenseElement,
} from '~/constants/license'
import {
  CC_LICENSES,
  DEPRECATED_CC_LICENSES,
  PUBLIC_DOMAIN_MARKS,
} from '~/constants/license'

import type VueI18n from 'vue-i18n'

/**
 * Get the full name of the license in a displayable format from the license
 * slug and version.
 *
 * @param license - the slug of the license
 * @param licenseVersion - the version number of the license
 * @param i18n - the i18n instance to access translations
 * @returns the full name of the license
 */
export const getFullLicenseName = (
  license: License,
  licenseVersion: LicenseVersion = '', // unknown version
  i18n: VueI18n | null = null
): string => {
  let licenseName

  // PDM has no abbreviation
  if (license === 'pdm' && i18n) {
    licenseName = i18n.t(`license-readable-names.${license}`).toString()
  } else {
    licenseName = license.toUpperCase().replace('SAMPLING', 'Sampling')
  }

  // If version is known, append version to the name
  if (licenseVersion) {
    licenseName = `${licenseName} ${licenseVersion}`
  }

  // For licenses other than public-domain marks, prepend 'CC' to the name
  if (!(PUBLIC_DOMAIN_MARKS as ReadonlyArray<License>).includes(license)) {
    licenseName = `CC ${licenseName}`
  }
  return licenseName.trim()
}

/**
 * CC licenses have different legal status from the public domain marks
 * such as CC0 and PDM, and need different wording. Check if the given name
 * belongs to a license and is not a public-domain mark.
 *
 * @param license - the license slug to check
 * @returns `false` if `license` is 'cc0' or 'pdm', `true` otherwise
 */
export const isLicense = (license: License): boolean => !isPublicDomain(license)

/**
 * CC licenses have different legal status from the public domain marks
 * such as CC0 and PDM, and need different wording. Check if the given name
 * belongs to a public-domain mark and is not a license.
 *
 * @param license - the license slug to check
 * @returns `true` if `license` is 'cc0' or 'pdm', `false` otherwise
 */
export const isPublicDomain = (license: License): boolean =>
  (PUBLIC_DOMAIN_MARKS as ReadonlyArray<string>).includes(license)

/**
 * Check if the given name belongs to a deprecated CC license. The full list of
 * deprecated licenses can be found on the
 * [Retired Legal Tools page](https://creativecommons.org/retiredlicenses/) on
 * the CC.org site.
 *
 * @param license - the license slug to check
 * @returns `true` if the license is a deprecated CC license, `false` otherwise
 */
export const isDeprecated = (license: License): boolean =>
  (DEPRECATED_CC_LICENSES as ReadonlyArray<License>).includes(license)

/**
 * Check if the given name belongs to a CC license, active or deprecated. This
 * includes CC0, which although not technically a license, is offered by CC.
 *
 * @param license - the license slug to check
 * @returns `true` if the license is a deprecated CC license, `false` otherwise
 */
export const isCc = (license: License): boolean =>
  license == 'cc0' ||
  (CC_LICENSES as ReadonlyArray<License>).includes(license) ||
  (DEPRECATED_CC_LICENSES as ReadonlyArray<License>).includes(license)

/**
 * Get the list of elements that comprise the given license or mark.
 *
 * @param license - the license for which to get the elements
 */
export const getElements = (license: License): LicenseElement[] => {
  if (license === 'pdm') {
    return ['pd']
  }

  const icons: LicenseElement[] = ['cc']
  if (license === 'cc0') {
    icons.push('zero')
  } else {
    const replacements: Record<string, LicenseElement> = {
      'sampling+': 'sampling-plus',
    }
    const elements = license
      .split('-')
      .map((element) =>
        element in replacements
          ? replacements[element]
          : (element as LicenseElement)
      )
    icons.push(...elements)
  }
  return icons
}
