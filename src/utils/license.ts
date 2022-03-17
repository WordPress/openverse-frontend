import type {
  License,
  PublicDomainMark,
  LicenseVersion,
  CcLicense,
} from '~/constants/license'
import {
  CC_LICENSES,
  DEPRECATED_CC_LICENSES,
  PUBLIC_DOMAIN_MARKS,
} from '~/constants/license'

// type LicenseName =
//   | `${Uppercase<PublicDomainMark>} 1.0`
//   | `CC ${Capitalize<DeprecatedCcLicense>} 1.0`
//   | `CC ${Uppercase<CcLicense>} ${LicenseVersion}`

type LicenseName =
  | `${Uppercase<PublicDomainMark>} ${LicenseVersion}` // technically only v1
  | `CC Sampling+ ${LicenseVersion}` // technically only v1
  | `CC NC-Sampling+ ${LicenseVersion}` // technically only v1
  | `CC ${Uppercase<CcLicense>} ${LicenseVersion}`

/**
 * Get the full name of the license in a displayable format from the license
 * slug and version.
 *
 * @param license - the slug of the license
 * @param licenseVersion - the version number of the license
 * @returns the full name of the license
 */
export const getFullLicenseName = (
  license: License,
  licenseVersion: LicenseVersion = '' // unknown version
): LicenseName => {
  if ((PUBLIC_DOMAIN_MARKS as ReadonlyArray<License>).includes(license)) {
    const licenseUpper = license.toUpperCase() as Uppercase<PublicDomainMark>
    return `${licenseUpper} ${licenseVersion}`
  }
  if (license === 'nc-sampling+') return `CC NC-Sampling+ ${licenseVersion}`
  if (license === 'sampling+') return `CC Sampling+ ${licenseVersion}`

  const licenseUpper = license.toUpperCase() as Uppercase<CcLicense>
  return `CC ${licenseUpper} ${licenseVersion}`
}

/**
 * CC licenses have different legal status from the public domain marks
 * such as CC0 and PDM, and need different wording. Check if the given name
 * belongs to a license and is not a public-domain mark.
 *
 * @param license - the license slug to check
 * @returns `false` if `license` is 'cc0' or 'pdm', `true` otherwise
 */
export const isLicense = (license: License): boolean =>
  !(PUBLIC_DOMAIN_MARKS as ReadonlyArray<License>).includes(license)

/**
 * CC licenses have different legal status from the public domain marks
 * such as CC0 and PDM, and need different wording. Check if the given name
 * belongs to a public-domain mark and is not a license.
 *
 * @param license - the license slug to check
 * @returns `true` if `license` is 'cc0' or 'pdm', `false` otherwise
 */
export const isPublicDomain = (license: License): boolean => !isLicense(license)

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
