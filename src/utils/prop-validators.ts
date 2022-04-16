import {
  SearchType,
  searchTypes,
  SupportedSearchType,
  supportedSearchTypes,
} from '~/constants/media'

/**
 * Validates the search types that have supported API endpoints.
 * This means that ALL_MEDIA is invalid because it is basically
 * a combination of all other supported API media types.
 * Any future search type that is not fully supported (video, 3d)
 * will also be invalid.
 */
export const isSupportedSearchType = (
  value: string
): value is SupportedSearchType => {
  return supportedSearchTypes.includes(value as SupportedSearchType)
}
/**
 * Validates strings that are search types. It includes all the search types in support
 * @param value - string value to be validated.
 */
export const isValidSearchType = (value: string): value is SearchType => {
  return searchTypes.includes(value as SearchType)
}
