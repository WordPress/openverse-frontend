import { i18nResultsCount } from '~/composables/use-i18n-utilities'
import { ALL_MEDIA, AUDIO, IMAGE, VIDEO } from '~/constants/media'
jest.mock('@nuxtjs/composition-api', () => ({
  useContext: () => ({
    i18n: {
      tc: (fullKey, resultsCount, { localeCount }) => ({
        fullKey,
        resultsCount,
        localeCount,
      }),
    },
    locale: 'en',
  }),
}))

describe('i18nResultsCount', () => {
  it.each`
    resultCount | mediaType    | expectedResult
    ${0}        | ${ALL_MEDIA} | ${{ fullKey: 'browse-page.all-no-results', resultsCount: 0, localeCount: '0' }}
    ${0}        | ${IMAGE}     | ${{ fullKey: 'browse-page.image-no-results', resultsCount: 0, localeCount: '0' }}
    ${0}        | ${AUDIO}     | ${{ fullKey: 'browse-page.audio-no-results', resultsCount: 0, localeCount: '0' }}
    ${0}        | ${VIDEO}     | ${''}
    ${10}       | ${ALL_MEDIA} | ${{ fullKey: 'browse-page.all-result-count', resultsCount: 10, localeCount: '10' }}
    ${10}       | ${IMAGE}     | ${{ fullKey: 'browse-page.image-result-count', resultsCount: 10, localeCount: '10' }}
    ${10}       | ${AUDIO}     | ${{ fullKey: 'browse-page.audio-result-count', resultsCount: 10, localeCount: '10' }}
    ${10}       | ${VIDEO}     | ${''}
    ${10000}    | ${ALL_MEDIA} | ${{ fullKey: 'browse-page.all-result-count-more', resultsCount: 10000, localeCount: '10,000' }}
    ${10000}    | ${IMAGE}     | ${{ fullKey: 'browse-page.image-result-count-more', resultsCount: 10000, localeCount: '10,000' }}
    ${10000}    | ${AUDIO}     | ${{ fullKey: 'browse-page.audio-result-count-more', resultsCount: 10000, localeCount: '10,000' }}
    ${10000}    | ${VIDEO}     | ${''}
  `(
    'Should show correct result for $resultCount of type $mediaType',
    ({ resultCount, mediaType, expectedResult }) => {
      const result = i18nResultsCount(resultCount, mediaType)

      expect(result).toEqual(expectedResult)
    }
  )
})
