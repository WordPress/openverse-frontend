import { createPinia, setActivePinia } from 'pinia'

import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  supportedSearchTypes,
  VIDEO,
} from '~/constants/media'
import { useSearchStore } from '~/stores/search'
import { mediaFilterKeys } from '~/constants/filters'

const initialState = {
  query: {
    aspect_ratio: '',
    categories: '',
    duration: '',
    extension: '',
    license: '',
    license_type: '',
    mature: '',
    q: '',
    searchBy: '',
    size: '',
    source: '',
  },
  searchType: ALL_MEDIA,
}
describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  describe('state', () => {
    it('initializes correctly', () => {
      const searchStore = useSearchStore()

      expect(searchStore.state).toEqual(initialState)
    })
  })
  describe('getters', () => {
    /**
     * For non-supported search types, the filters fall back to 'All content' filters.
     * Number of displayed filters is one less than the number of mediaFilterKeys
     * because `mature` filter is not displayed.
     */
    it.each`
      searchType   | filterTypeCount
      ${IMAGE}     | ${mediaFilterKeys[IMAGE].length}
      ${AUDIO}     | ${mediaFilterKeys[AUDIO].length}
      ${ALL_MEDIA} | ${mediaFilterKeys[ALL_MEDIA].length}
      ${VIDEO}     | ${mediaFilterKeys[VIDEO].length}
    `(
      'mediaFiltersForDisplay returns $filterTypeCount filters for $searchType',
      ({ searchType, filterTypeCount }) => {
        const searchStore = useSearchStore()
        searchStore.updateQuery({ searchType })
        const filtersForDisplay = searchStore.searchFilters
        const expectedFilterCount = Math.max(0, filterTypeCount - 1)
        expect(Object.keys(filtersForDisplay).length).toEqual(
          expectedFilterCount
        )
      }
    )
    /**
     * Check for some special cases:
     * - `mature` and `searchBy`.
     * - several options for single filter.
     * - media specific filters that are unique (durations).
     * - media specific filters that have the same API param (extensions)
     */
    it.each`
      query                                               | searchType
      ${{ q: 'cat', license: 'by', mature: 'true' }}      | ${IMAGE}
      ${{ q: 'cat', license: 'by', searchBy: 'creator' }} | ${ALL_MEDIA}
      ${{ q: 'cat', license: 'cc0,pdm,by,by-nc' }}        | ${ALL_MEDIA}
      ${{ q: 'cat', duration: 'medium' }}                 | ${AUDIO}
      ${{ q: 'cat', extension: 'svg' }}                   | ${IMAGE}
      ${{ q: 'cat', extension: 'svg' }}                   | ${AUDIO}
      ${{ q: 'cat', extension: 'mp3' }}                   | ${AUDIO}
    `(
      'returns correct searchQueryParams and filter status for $query and searchType $searchType',
      ({ query, searchType }) => {
        const searchStore = useSearchStore()
        const expectedQueryParams = query
        // It should discard the values that are not applicable for the search type:
        if (searchType === AUDIO && query.extension === 'svg') {
          delete expectedQueryParams.extension
        }
        searchStore.setSearchStateFromUrl({
          path: `/search/${searchType === ALL_MEDIA ? '' : searchType}`,
          query: { ...expectedQueryParams },
        })
        expect(searchStore.searchQueryParams).toEqual(expectedQueryParams)
      }
    )
  })
  describe('actions', () => {
    it.each`
      query           | searchType
      ${{ q: 'foo' }} | ${undefined}
      ${undefined}    | ${AUDIO}
      ${{ q: 'cat' }} | ${AUDIO}
    `(
      '`updateQuery` updates query.q and searchType parameters with $query and $searchType',
      ({ query, searchType }) => {
        const searchStore = useSearchStore()
        const expectedSearchTerm = query?.q ?? ''
        const expectedSearchType = searchType ?? ALL_MEDIA

        searchStore.updateQuery({ ...query, searchType })

        expect(searchStore.query.q).toEqual(expectedSearchTerm)
        expect(searchStore.searchType).toEqual(expectedSearchType)
      }
    )

    it('`updateQuery` does not change anything without params', () => {
      const searchStore = useSearchStore()
      const expectedSearchTerm = ''
      const expectedSearchType = ALL_MEDIA

      searchStore.updateQuery()

      expect(searchStore.query.q).toEqual(expectedSearchTerm)
      expect(searchStore.searchType).toEqual(expectedSearchType)
    })

    it.each`
      searchType | path
      ${'all'}   | ${'/search/'}
      ${'image'} | ${'/search/image/'}
      ${'audio'} | ${'/search/audio/'}
      ${'video'} | ${'/search/video'}
    `(
      "`setSearchStateFromUrl` should set searchType '$searchType' from path '$path'",
      ({ searchType, path }) => {
        const searchStore = useSearchStore()
        const expectedQuery = searchStore.query

        searchStore.setSearchStateFromUrl({ path: path, query: {} })

        expect(searchStore.searchType).toEqual(searchType)
        expect(searchStore.query).toEqual(expectedQuery)
      }
    )

    it.each`
      query                                | path                | searchType
      ${{ license: 'cc0,by', q: 'cat' }}   | ${'/search/'}       | ${ALL_MEDIA}
      ${{ searchBy: 'creator', q: 'dog' }} | ${'/search/image/'} | ${IMAGE}
      ${{ mature: 'true', q: 'galah' }}    | ${'/search/audio/'} | ${AUDIO}
      ${{ duration: 'medium' }}            | ${'/search/image'}  | ${IMAGE}
    `(
      "`setSearchStateFromUrl` should set '$searchType' from query  $query and path '$path'",
      ({ query, path, searchType }) => {
        const searchStore = useSearchStore()
        const expectedQuery = { ...searchStore.query, ...query }
        // The values that are not applicable for the search type should be discarded
        if (searchType === IMAGE) {
          expectedQuery.duration = ''
        }

        searchStore.setSearchStateFromUrl({ path: path, query: query })

        expect(searchStore.searchType).toEqual(searchType)
        expect(searchStore.query).toEqual(expectedQuery)
      }
    )

    it.each`
      filters                                                               | query
      ${[['licenses', 'by'], ['licenses', 'by-nc-sa']]}                     | ${['license', 'by,by-nc-sa']}
      ${[['licenseTypes', 'commercial'], ['licenseTypes', 'modification']]} | ${['license_type', 'commercial,modification']}
      ${[['searchBy', 'creator']]}                                          | ${['searchBy', 'creator']}
      ${[['mature', 'mature']]}                                             | ${['mature', 'true']}
      ${[['sizes', 'large']]}                                               | ${['size', '']}
    `(
      'toggleFilter updates the query values to $query',
      ({ filters, query }) => {
        const searchStore = useSearchStore()
        for (const filterItem of filters) {
          const [filterType, code] = filterItem
          searchStore.toggleFilter({ filterType, code })
        }
        expect(searchStore.query[query[0]]).toEqual(query[1])
      }
    )
    // toggleFilter, clearFilters,

    it.each([ALL_MEDIA, IMAGE, AUDIO, VIDEO])(
      'Clears filters when search type is %s',
      (searchType) => {
        const searchStore = useSearchStore()
        const expectedQuery = { ...searchStore.query, q: 'cat' }
        searchStore.setSearchStateFromUrl({
          path: `/search/${searchType === ALL_MEDIA ? '' : searchType}`,
          query: {
            q: 'cat',
            license: 'cc0',
            sizes: 'large',
            extension: 'jpg,mp3',
          },
        })
        if (supportedSearchTypes.includes(searchType)) {
          expect(searchStore.query).not.toEqual(expectedQuery)
        }

        searchStore.clearFilters()
        expect(searchStore.query).toEqual(expectedQuery)
      }
    )
  })
})
