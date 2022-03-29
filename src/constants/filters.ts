import { kebab } from 'case'

import { ALL_MEDIA, AUDIO, IMAGE, MODELS_3D, VIDEO } from '~/constants/media'
import { ACTIVE_LICENSES } from '~/constants/license'
import { deepFreeze } from '~/utils/deep-freeze'

import type { SearchType } from '~/constants/media'
import type { FilterCategory, FilterItem } from '~/store/types'

/**
 * List of filters available for each search type. The order of the keys
 * is the same as in the filter checklist display (sidebar or modal).
 */
export const mediaFilterKeys = deepFreeze<Record<SearchType, FilterCategory[]>>(
  {
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
    [MODELS_3D]: [],
    [ALL_MEDIA]: ['licenseTypes', 'licenses', 'searchBy', 'mature'],
  }
)

/**
 * A list of filters that are only used for the specific content type.
 * This is used to clear filters from other content types when changing the content type.
 */
export const mediaUniqueFilterKeys = deepFreeze<
  Record<SearchType, FilterCategory[]>
>({
  [ALL_MEDIA]: [],
  [IMAGE]: [
    'imageCategories',
    'imageExtensions',
    'aspectRatios',
    'sizes',
    'imageProviders',
  ],
  [AUDIO]: [
    'audioCategories',
    'audioExtensions',
    'durations',
    'audioProviders',
  ],
  [VIDEO]: [],
  [MODELS_3D]: [],
})

const filterCodesPerCategory = deepFreeze<Record<FilterCategory, string[]>>({
  licenses: [...ACTIVE_LICENSES],
  licenseTypes: ['commercial', 'modification'],
  audioCategories: [
    'audiobook',
    'music',
    'news',
    'podcast',
    'pronunciation',
    'sound_effect',
  ],
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
})
/**
 * Converts the filterCodesPerCategory object into the format that's used by the filter store.
 * Name is used as the i18n $t key.
 * ```
 * {
 *   "audioCategories": [
 *     {
 *       "code": "music",
 *       "name": "filters.audioCategories.music",
 *       "checked": false
 *     }, ...
 *   ],
 * }
 *```
 */
export const initFilters = () =>
  Object.entries(filterCodesPerCategory).reduce(
    (acc, [filterType, filters]) => ({
      ...acc,
      [filterType]: filters.map((item) => ({
        code: item,
        name: `filters.${kebab(filterType)}.${item}`,
        checked: false,
      })),
    }),
    {} as Record<FilterCategory, FilterItem>
  )

export const filterData = deepFreeze(initFilters())
