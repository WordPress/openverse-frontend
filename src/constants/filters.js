import { ALL_MEDIA, AUDIO, IMAGE, VIDEO } from '~/constants/media'
import { ACTIVE_LICENSES } from '~/constants/license'
import { kebabize } from '~/utils/format-strings'
import { deepFreeze } from '~/utils/deep-freeze.ts'

/**
 * List of filters available for each search type. The order of the keys
 * is the same as in the filter checklist display (sidebar or modal).
 * @type { Record<import('../store/types').SearchType, import('../store/types').FilterType[]>}
 */
export const mediaFilterKeys = {
  [IMAGE]: [
    'licenseTypes',
    'licenses',
    'imageCategories',
    'imageExtensions',
    'aspectRatios',
    'sizes',
    'imageProviders',
    'searchBy',
    'mature',
  ],
  [AUDIO]: [
    'licenseTypes',
    'licenses',
    'audioCategories',
    'audioExtensions',
    'durations',
    'audioProviders',
    'searchBy',
    'mature',
  ],
  [VIDEO]: [],
  [ALL_MEDIA]: ['licenseTypes', 'licenses', 'searchBy', 'mature'],
}

/**
 * @type {Record<import('../store/types').FilterType, string[]>}
 */
const filterCodesPerCategory = {
  licenses: ACTIVE_LICENSES,
  licenseTypes: ['commercial', 'modification'],
  audioCategories: ['music', 'sound', 'podcast'],
  imageCategories: ['photograph', 'illustration', 'digitized_artwork'],
  audioExtensions: ['mp3', 'ogg', 'flac'],
  imageExtensions: ['jpg', 'png', 'gif', 'svg'],
  aspectRatios: ['tall', 'wide', 'square'],
  durations: ['short', 'medium', 'long'],
  sizes: ['small', 'medium', 'large'],
  audioProviders: [],
  imageProviders: [],
  searchBy: ['creator'],
  mature: ['mature'],
}
const initFilters = () => {
  const filters = {}
  const filterTypes = /** @type {import('../store/types').FilterType[]}*/ (
    Object.keys(filterCodesPerCategory)
  )
  filterTypes.forEach((filterType) => {
    filters[filterType] = filterCodesPerCategory[filterType].map((item) => ({
      code: item,
      name: `filters.${kebabize(filterType)}.${item}`,
      checked: false,
    }))
  })
  return filters
}
/**
 * A list of filters that are only used for the specific content type.
 * This is used to clear filters from other content types when changing the content type.
 * @type {Record<import('../store/types').SearchType, import('../store/types').FilterType[]>}
 */
export const mediaSpecificFilters = {
  all: [],
  image: [
    'imageCategories',
    'imageExtensions',
    'aspectRatios',
    'sizes',
    'imageProviders',
  ],
  audio: ['audioCategories', 'audioExtensions', 'durations', 'audioProviders'],
  video: [],
}

/** @type {import('../store/types').Filters} */
export const filterData = deepFreeze(initFilters())
