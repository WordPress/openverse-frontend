import { useContext } from '@nuxtjs/composition-api'
import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  supportedContentTypes,
} from '~/constants/media'

/**
 * Not using dynamically-generated keys to ensure that
 * correct line is shown in the 'po' locale files
 */
const i18nKeys = {
  [ALL_MEDIA]: {
    noResult: 'browse-page.all-no-results',
    result: 'browse-page.all-result-count',
    more: 'browse-page.all-result-count-more',
  },
  [AUDIO]: {
    noResult: 'browse-page.audio-no-results',
    result: 'browse-page.audio-result-count',
    more: 'browse-page.audio-result-count-more',
  },
  [IMAGE]: {
    noResult: 'browse-page.image-no-results',
    result: 'browse-page.image-result-count',
    more: 'browse-page.image-result-count-more',
  },
}

/**
 * Returns the localized text for the number of search results according to the
 * media type. Returns blank string if the content type is not supported.
 * Content types include the special case of `All` media type.
 *
 * @param {number} resultsCount
 * @param {string} [mediaType]
 * @returns {string}
 */
export function i18nResultsCount(resultsCount, mediaType = ALL_MEDIA) {
  if (!supportedContentTypes.includes(mediaType)) {
    return ''
  }
  const { i18n } = useContext()

  const countKey =
    resultsCount === 0 ? 'noResult' : resultsCount >= 10000 ? 'more' : 'result'
  const fullKey = i18nKeys[mediaType][countKey]
  const localeCount = resultsCount.toLocaleString(i18n.locale)
  return i18n.tc(fullKey, resultsCount, { localeCount })
}
