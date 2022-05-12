import { useI18n } from '~/composables/use-i18n'

const WESTERN_ARABIC_NUMERALS = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]

/**
 * Guards number formatting to prevent using Eastern Arabic Numerals,
 * instead always using Western Arabic Numerals but still respecting
 * the locale preferences for delimiters.
 */
export const useGetLocaleFormattedNumber = () => {
  const i18n = useI18n()

  return (n: number) => {
    const testFormat = n.toLocaleString(i18n.locale)

    if (
      WESTERN_ARABIC_NUMERALS.some((numeral) => testFormat.includes(numeral))
    ) {
      return testFormat
    }

    return n.toLocaleString('en')
  }
}
