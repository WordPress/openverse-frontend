import VueI18n from 'vue-i18n'
import { render, screen } from '@testing-library/vue'
import { AUDIO, IMAGE } from '~/constants/media'
import VContentLink from '~/components/VContentLink/VContentLink.vue'

const enMessages = require('~/locales/en.json')
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: enMessages },
})

describe('i18nResultsCount in a component', () => {
  let options = {}
  let count
  beforeEach(() => {
    options = {
      props: { mediaType: 'image', resultsCount: count },
      mocks: { $nuxt: { context: { i18n } } },
    }
  })

  it.each`
    resultCount | mediaType | expectedText
    ${0}        | ${IMAGE}  | ${'No image results'}
    ${0}        | ${AUDIO}  | ${'No audio results'}
    ${1}        | ${IMAGE}  | ${'1 image result'}
    $10}        | ${AUDIO}  | ${'1 audio result'}
    ${10}       | ${IMAGE}  | ${'10 image results'}
    ${10}       | ${AUDIO}  | ${'10 audio results'}
    ${10000}    | ${IMAGE}  | ${'Over 10,000 image results'}
    ${10000}    | ${AUDIO}  | ${'Over 10,000 audio results'}
  `(
    'Should show correct result for $resultCount of type $mediaType',
    async ({ resultCount, mediaType, expectedText }) => {
      options.props.mediaType = mediaType
      options.props.resultsCount = resultCount
      render(VContentLink, options)
      const expectedLabel = new RegExp(expectedText, 'i')
      const labelElement = await screen.getByText(expectedLabel)
      expect(labelElement).toBeVisible()
    }
  )
})
