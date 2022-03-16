import clonedeep from 'lodash.clonedeep'

import { mediaFilterKeys } from '~/constants/filters'
import { ALL_MEDIA } from '~/constants/media'

import { getParameterByName } from '~/utils/url-params'

const filterPropertyMappings = {
  licenses: 'license',
  licenseTypes: 'license_type',
  audioCategories: 'categories',
  imageCategories: 'categories',
  audioExtensions: 'extension',
  imageExtensions: 'extension',
  durations: 'duration',
  aspectRatios: 'aspect_ratio',
  sizes: 'size',
  audioProviders: 'source',
  imageProviders: 'source',
  searchBy: 'searchBy',
  mature: 'mature',
}

const getMediaFilterTypes = (searchType) => [...mediaFilterKeys[searchType]]
// {
//   license: 'cc0,pdm,by,by-sa,by-nc,by-nd,by-nc-sa,by-nc-nd',
//   imageCategories: 'photograph,illustration,digitized_artwork',
//   imageExtension: 'jpg,png',
//   aspect_ratio: 'square',
//   size: 'small',
//   source: 'animaldiversity,bio_diversity,brooklynmuseum,CAPL,clevelandmuseum,deviantart'
// }

/**
 * Joins all the filters which have the checked property `true`
 * to a string separated by commas for the API request URL, e.g.: "by,nd-nc,nc-sa".
 * Mature is a special case, and is converted to `true`.
 * @param {import('../store/types').FilterItem[]} filterItem
 */
const filterToString = (filterItem) => {
  const filterString = filterItem
    .filter((f) => f.checked)
    .map((filterItem) => filterItem.code)
    .join(',')
  return filterString === 'mature' ? 'true' : filterString
}

/**
 * Converts the filter store object to the data format accepted by the API,
 * which has slightly different property names.
 * @param {object} filters object containing the filter data that comes from the filter store
 * @param {import('../constants/media').SearchType} searchType
 * @param hideEmpty
 * @todo Refactor all of these 'reduce' calls to just use lodash methods :)
 * @returns {import('../store/types').ApiQueryFilters}
 */
export const filtersToQueryData = (
  filters,
  searchType = ALL_MEDIA,
  hideEmpty = true
) => {
  let mediaFilterTypes = getMediaFilterTypes(searchType)

  return mediaFilterTypes.reduce((query, filterCategory) => {
    const queryKey = filterPropertyMappings[filterCategory]
    const queryValue = filterToString(filters[filterCategory])
    if (queryValue || !hideEmpty) {
      query[queryKey] = queryValue
    }
    return query
  }, /** @type {import('../store/types').ApiQueryFilters} */ ({}))
}

/**
 * Extract search type from the url. Returns the last part
 * of the path between `/search/` and query, or `all` by default.
 * `/search/?q=test`: all
 * `/search/image?q=test`: image
 * @param {string} queryString
 * @return {import('../constants/media').SearchType}
 */
export const queryStringToSearchType = (queryString) => {
  const searchTypePattern = /\/search\/(image|audio|video)\?*/
  let matchedType = queryString.match(searchTypePattern)
  return matchedType === null ? ALL_MEDIA : matchedType[1]
}

/**
 * `source`, `extensions` and `categories` API parameters correspond
 * to different filters in different media types:
 * `source` - audioProviders/imageProviders
 * `extensions` - audioExtensions/imageExtensions
 * `categories` - audioCategories/imageCategories
 * This function sets only filters that are possible for current
 * media type. E.g., for queryString `search/audio?extensions=ogg`
 * the `audioExtensions.ogg.checked` is set to true,
 * but for `search/images?extensions=ogg`, the extensions query parameter
 * is discarded, because `ogg` is not a valid extension for images.
 * @param {string} filterParameter
 * @param {import('../store/types').FilterItem[]} parameterFilters
 * @return {import('../store/types').FilterItem[]}
 */
const getMediaTypeApiFilters = (filterParameter, parameterFilters) => {
  if (filterParameter !== '') {
    const parameterValues = filterParameter.split(',')
    parameterValues.forEach((parameter) => {
      let existingParameterIdx = parameterFilters.findIndex(
        (p) => p.code === parameter
      )
      if (existingParameterIdx > -1) {
        parameterFilters[existingParameterIdx] = {
          ...parameterFilters[existingParameterIdx],
          checked: true,
        }
      }
    })
  }
  return parameterFilters
}

/**
 * converts the browser filter query string into the internal filter store data format
 * @param {object} params
 * @param {Record<string, string>} params.query - browser filter query
 * @param {import('../constants/media').SearchType} [params.searchType]
 * @param {object} params.defaultFilters default filters for testing purposes
 */
export const queryToFilterData = ({
  query,
  searchType = 'image',
  defaultFilters,
}) => {
  // The default filterData object from search store doesn't contain provider filters,
  // so we can't use it.
  const filters = clonedeep(defaultFilters)
  const filterTypes = getMediaFilterTypes(searchType)
  const differentFiltersWithSameApiParams = [
    'audioProviders',
    'imageProviders',
    'audioExtensions',
    'imageExtensions',
    'audioCategories',
    'imageCategories',
  ]
  filterTypes.forEach((filterDataKey) => {
    if (differentFiltersWithSameApiParams.includes(filterDataKey)) {
      const parameter = query[filterPropertyMappings[filterDataKey]]
      if (parameter) {
        filters[filterDataKey] = getMediaTypeApiFilters(
          parameter,
          filters[filterDataKey]
        )
      }
    } else {
      const queryDataKey = filterPropertyMappings[filterDataKey]
      if (query[queryDataKey]) {
        const filterValues = query[queryDataKey].split(',')
        filterValues.forEach((val) => {
          const idx = filters[filterDataKey].findIndex((f) => f.code === val)
          if (idx >= 0) {
            filters[filterDataKey][idx].checked = true
          }
        })
      }
    }
  })

  return filters
}

/**
 * converts the url query string to the data format accepted by the API.
 *
 * this is slightly different from filtersToQueryData as this converts the
 * query string and that converts the filter data.
 *
 * TODO: we might be able to refactor to eliminate the need for these two
 * separate functions.
 * @param {string} queryString
 */
export const queryStringToQueryData = (queryString) => {
  const queryDataObject = {}
  const searchType = queryStringToSearchType(queryString)
  const filterTypes = getMediaFilterTypes(searchType)
  filterTypes.forEach((filterDataKey) => {
    const queryDataKey = filterPropertyMappings[filterDataKey]
    queryDataObject[queryDataKey] = getParameterByName(
      queryDataKey,
      queryString
    )
  })
  queryDataObject.q = getParameterByName('q', queryString)

  return queryDataObject
}

export const areQueriesEqual = (oldQuery, newQuery) => {
  for (let key of Object.keys(oldQuery)) {
    if (oldQuery[key] !== newQuery[key]) {
      return false
    }
  }
  return true
}
