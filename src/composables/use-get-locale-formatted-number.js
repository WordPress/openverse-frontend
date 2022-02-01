import { useContext } from '@nuxtjs/composition-api'

export const EASTERN_ARABIC_NUMERAL_LOCALES = ['ar', 'fa', 'ckb', 'ps']

/**
 * Guards number formatting to prevent using Eastern Arabic Numerals,
 * instead always using Western Arabic Numerals but still respecting
 * the locale preferences for delimiters.
 *
 * @returns {(n: number) => string}
 */
export const useGetLocaleFormattedNumber = () => {
  const { i18n } = useContext()

  /**
   * @param {number} n The number to format
   */
  return (n) => {
    let { locale } = i18n

    if (EASTERN_ARABIC_NUMERAL_LOCALES.some((l) => locale.startsWith(l))) {
      locale = 'en-gb'
    }

    return n.toLocaleString(locale)
  }
}
