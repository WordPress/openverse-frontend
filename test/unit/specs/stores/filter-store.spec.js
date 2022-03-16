import { setActivePinia, createPinia } from 'pinia'

import { nextTick } from '@nuxtjs/composition-api'

import { useFilterStore } from '~/stores/filter'
import { filterData, mediaFilterKeys } from '~/constants/filters.ts'
import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  supportedSearchTypes,
  VIDEO,
} from '~/constants/media'
import { warn } from '~/utils/console.ts'

jest.mock('~/utils/console', () => ({
  warn: jest.fn(),
}))

describe('Filter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  describe('state', () => {
    it('sets initial filters to filterData', () => {
      const filterStore = useFilterStore()
      expect(filterStore.filters).toEqual(filterData)
    })
  })
  describe('getters', () => {
    /**
     * Check for some special cases:
     * - `mature` and `searchBy`.
     * - several options for single filter.
     * - media specific filters that are unique (durations).
     * - media specific filters that have the same API param (extensions)
     */
    it.each`
      query                                          | searchType   | filterCount
      ${{ licenses: ['by'], mature: ['mature'] }}    | ${IMAGE}     | ${1}
      ${{ licenses: ['by'], searchBy: ['creator'] }} | ${ALL_MEDIA} | ${2}
      ${{ licenses: ['cc0', 'pdm', 'by', 'by-nc'] }} | ${ALL_MEDIA} | ${4}
      ${{ durations: ['medium'] }}                   | ${AUDIO}     | ${1}
      ${{ imageExtensions: ['svg'] }}                | ${IMAGE}     | ${1}
      ${{ audioExtensions: ['mp3'] }}                | ${AUDIO}     | ${1}
    `(
      'returns correct filter status for $query and searchType $searchType',
      ({ query, searchType, filterCount }) => {
        const filterStore = useFilterStore()
        filterStore.setSearchType(searchType)
        for (let [filterType, values] of Object.entries(query)) {
          values.forEach((val) =>
            filterStore.toggleFilter({ filterType, code: val })
          )
        }

        expect(filterStore.appliedFilterCount).toEqual(filterCount)
        expect(filterStore.isAnyFilterApplied).toBe(filterCount > 0)
      }
    )
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
        const filterStore = useFilterStore()
        filterStore.setSearchType(searchType)
        const filtersForDisplay = filterStore.searchFilters
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
     * - no 'q' parameter in the query.
     */
    it.each`
      query                                               | searchType
      ${{ q: 'cat', license: 'by', mature: 'true' }}      | ${IMAGE}
      ${{ license: 'by', mature: 'true' }}                | ${IMAGE}
      ${{ license: '', mature: '' }}                      | ${IMAGE}
      ${{ q: 'cat', license: 'by', searchBy: 'creator' }} | ${ALL_MEDIA}
      ${{ q: 'cat', license: 'cc0,pdm,by,by-nc' }}        | ${ALL_MEDIA}
      ${{ q: 'cat', duration: 'medium' }}                 | ${AUDIO}
      ${{ q: 'cat', extension: 'svg' }}                   | ${IMAGE}
      ${{ q: 'cat', extension: 'svg' }}                   | ${AUDIO}
      ${{ q: 'cat', extension: 'mp3' }}                   | ${AUDIO}
    `(
      'returns correct searchQueryParams and filter status for $query and searchType $searchType',
      ({ query, searchType }) => {
        const filterStore = useFilterStore()
        const expectedQueryParams = query
        // It should discard the values that are not applicable for the search type:
        if (searchType === AUDIO && query.extension === 'svg') {
          delete expectedQueryParams.extension
        }
        filterStore.setSearchStateFromUrl({
          path: `/search/${searchType === ALL_MEDIA ? '' : searchType}`,
          urlQuery: { ...expectedQueryParams },
        })
        // Edge-case: query parameter value is a blank string
        for (let param in expectedQueryParams) {
          if (expectedQueryParams[param] === '')
            delete expectedQueryParams[param]
        }
        // Should add a blank string as `q` value if `q` is not in query
        if (!('q' in expectedQueryParams)) {
          expectedQueryParams.q = ''
        }
        expect(filterStore.searchQueryParams).toEqual(expectedQueryParams)
      }
    )
  })
  describe('actions', () => {
    it.each(['foo', ''])(
      '`setSearchTerm correctly updates the searchTerm',
      (searchTerm) => {
        const filterStore = useFilterStore()
        const expectedSearchTerm = searchTerm
        filterStore.setSearchTerm(searchTerm)
        expect(filterStore.searchTerm).toEqual(expectedSearchTerm)
      }
    )
    it.each(supportedSearchTypes)(
      'setSearchType correctly updates the searchType',
      (type) => {
        const filterStore = useFilterStore()
        filterStore.setSearchType(type)

        expect(filterStore.searchType).toEqual(type)
      }
    )

    it.each`
      searchType | path
      ${'all'}   | ${'/search/'}
      ${'image'} | ${'/search/image/'}
      ${'audio'} | ${'/search/audio/'}
      ${'video'} | ${'/search/video'}
    `(
      "`setSearchStateFromUrl` should set searchType '$searchType' from path '$path'",
      ({ searchType, path }) => {
        const filterStore = useFilterStore()
        filterStore.setSearchStateFromUrl({ path: path, urlQuery: {} })

        expect(filterStore.searchType).toEqual(searchType)
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
        const filterStore = useFilterStore()
        const expectedQuery = { ...filterStore.searchQueryParams, ...query }
        // The values that are not applicable for the search type should be discarded
        if (searchType === IMAGE) {
          delete expectedQuery.duration
        }

        filterStore.setSearchStateFromUrl({ path: path, urlQuery: query })

        expect(filterStore.searchType).toEqual(searchType)
        expect(filterStore.searchQueryParams).toEqual(expectedQuery)
      }
    )

    it.each`
      filters                                                               | query
      ${[['licenses', 'by'], ['licenses', 'by-nc-sa']]}                     | ${['license', 'by,by-nc-sa']}
      ${[['licenseTypes', 'commercial'], ['licenseTypes', 'modification']]} | ${['license_type', 'commercial,modification']}
      ${[['searchBy', 'creator']]}                                          | ${['searchBy', 'creator']}
      ${[['mature', 'mature']]}                                             | ${['mature', 'true']}
      ${[['sizes', 'large']]}                                               | ${['size', undefined]}
    `(
      'toggleFilter updates the query values to $query',
      ({ filters, query }) => {
        const filterStore = useFilterStore()
        for (const filterItem of filters) {
          const [filterType, code] = filterItem
          filterStore.toggleFilter({ filterType, code })
        }
        expect(filterStore.searchQueryParams[query[0]]).toEqual(query[1])
      }
    )

    it.each([ALL_MEDIA, IMAGE, AUDIO, VIDEO])(
      'Clears filters when search type is %s',
      (searchType) => {
        const filterStore = useFilterStore()
        const expectedQueryParams = { q: 'cat' }
        filterStore.setSearchStateFromUrl({
          path: `/search/${searchType === ALL_MEDIA ? '' : searchType}`,
          urlQuery: {
            q: 'cat',
            license: 'cc0',
            sizes: 'large',
            extension: 'jpg,mp3',
          },
        })
        if (supportedSearchTypes.includes(searchType)) {
          expect(filterStore.query).not.toEqual(expectedQueryParams)
        }
        filterStore.clearFilters()
        expect(filterStore.searchQueryParams).toEqual(expectedQueryParams)
      }
    )
  })
  describe('actions', () => {
    it.each`
      filterType           | codeIdx
      ${'licenses'}        | ${0}
      ${'licenseTypes'}    | ${0}
      ${'imageExtensions'} | ${0}
      ${'imageCategories'} | ${0}
      ${'searchBy'}        | ${0}
      ${'aspectRatios'}    | ${0}
      ${'sizes'}           | ${0}
      ${'mature'}          | ${0}
    `(
      'toggleFilter updates $filterType filter state',
      ({ filterType, codeIdx }) => {
        const filterStore = useFilterStore()

        filterStore.toggleFilter({ filterType, codeIdx })
        const filterItem = filterStore.filters[filterType][codeIdx]
        expect(filterItem.checked).toEqual(true)
      }
    )

    it('toggleFilter updates isFilterApplied with provider', () => {
      const filterStore = useFilterStore()
      filterStore.setSearchType(IMAGE)
      filterStore.initProviderFilters({
        mediaType: IMAGE,
        providers: [{ source_name: 'met', display_name: 'Met' }],
      })

      filterStore.toggleFilter({ filterType: 'imageProviders', code: 'met' })
      expect(filterStore.appliedFilterCount).toEqual(1)
      expect(filterStore.isAnyFilterApplied).toEqual(true)
    })

    it('toggleFilter updates isFilterApplied with license type', () => {
      const filterStore = useFilterStore()
      filterStore.toggleFilter({ filterType: 'licenseTypes', codeIdx: 0 })

      expect(filterStore.isAnyFilterApplied).toEqual(true)
    })

    it('initProviderFilters merges with existing provider filters', () => {
      const filterStore = useFilterStore()
      const existingProviderFilters = [{ code: 'met', checked: true }]

      filterStore.$patch({
        filters: { imageProviders: existingProviderFilters },
      })
      const providers = [
        { source_name: 'met', display_name: 'Metropolitan' },
        { source_name: 'flickr', display_name: 'Flickr' },
      ]

      filterStore.initProviderFilters({
        mediaType: 'image',
        providers: providers,
      })

      expect(filterStore.filters.imageProviders).toEqual([
        { code: 'met', name: 'Metropolitan', checked: true },
        { code: 'flickr', name: 'Flickr', checked: false },
      ])
    })

    it('clearFilters resets filters to initial state', async () => {
      const filterStore = useFilterStore()
      filterStore.filters.licenses = [
        { code: 'by', checked: true },
        { code: 'by-nc', checked: true },
        { code: 'by-nd', checked: true },
      ]
      filterStore.clearFilters()
      expect(filterStore.filters).toEqual(filterData)
    })

    it('clearFilters sets providers filters checked to false', async () => {
      const filterStore = useFilterStore()
      filterStore.filters.imageProviders = [
        { code: 'met', name: 'Metropolitan', checked: true },
        { code: 'flickr', name: 'Flickr', checked: false },
      ]

      filterStore.clearFilters()
      const expectedFilters = {
        ...filterStore.filters,
        imageProviders: [
          { code: 'met', name: 'Metropolitan', checked: false },
          { code: 'flickr', name: 'Flickr', checked: false },
        ],
      }
      expect(filterStore.filters).toEqual(expectedFilters)
    })

    it.each`
      filterType           | code              | idx
      ${'licenses'}        | ${'cc0'}          | ${0}
      ${'licenseTypes'}    | ${'modification'} | ${1}
      ${'imageExtensions'} | ${'svg'}          | ${3}
      ${'imageCategories'} | ${'photograph'}   | ${0}
      ${'searchBy'}        | ${'creator'}      | ${0}
      ${'mature'}          | ${'mature'}       | ${-0}
      ${'aspectRatios'}    | ${'tall'}         | ${0}
      ${'sizes'}           | ${'medium'}       | ${1}
    `(
      "toggleFilter should set filter '$code' of type '$filterType",
      ({ filterType, code, idx }) => {
        const filterStore = useFilterStore()
        filterStore.toggleFilter({ filterType: filterType, code: code })

        const filterItem = filterStore.filters[filterType][idx]

        expect(filterItem.checked).toEqual(true)
      }
    )
    it.each`
      item                                                    | dependency                                              | disabled
      ${{ code: 'by-nc', filterType: 'licenses' }}            | ${{ filterType: 'licenseTypes', code: 'commercial' }}   | ${true}
      ${{ code: 'by-nc-nd', filterType: 'licenses' }}         | ${{ filterType: 'licenseTypes', code: 'commercial' }}   | ${true}
      ${{ code: 'by-nc-sa', filterType: 'licenses' }}         | ${{ filterType: 'licenseTypes', code: 'commercial' }}   | ${true}
      ${{ code: 'by-nd', filterType: 'licenses' }}            | ${{ filterType: 'licenseTypes', code: 'modification' }} | ${true}
      ${{ code: 'by-nc-nd', filterType: 'licenses' }}         | ${{ filterType: 'licenseTypes', code: 'modification' }} | ${true}
      ${{ code: 'by-nc', filterType: 'licenses' }}            | ${{ filterType: 'licenseTypes', code: 'modification' }} | ${false}
      ${{ code: 'by-nd', filterType: 'licenses' }}            | ${{ filterType: 'licenseTypes', code: 'commercial' }}   | ${false}
      ${{ code: 'commercial', filterType: 'licenseTypes' }}   | ${{ filterType: 'licenses', code: 'by-nc' }}            | ${true}
      ${{ code: 'commercial', filterType: 'licenseTypes' }}   | ${{ filterType: 'licenses', code: 'by-nc-nd' }}         | ${true}
      ${{ code: 'commercial', filterType: 'licenseTypes' }}   | ${{ filterType: 'licenses', code: 'by-nc-sa' }}         | ${true}
      ${{ code: 'modification', filterType: 'licenseTypes' }} | ${{ filterType: 'licenses', code: 'by-nd' }}            | ${true}
      ${{ code: 'modification', filterType: 'licenseTypes' }} | ${{ filterType: 'licenses', code: 'by-nc-nd' }}         | ${true}
    `(
      'isFilterDisabled for $item.code should return $disabled when $dependency.code is checked',
      ({ item, dependency, disabled }) => {
        const filterStore = useFilterStore()
        filterStore.toggleFilter({
          filterType: dependency.filterType,
          code: dependency.code,
        })
        const isDisabled = filterStore.isFilterDisabled(item, item.filterType)
        expect(isDisabled).toBe(disabled)
      }
    )

    it('toggleFilter without code or codeIdx parameters warns about it', () => {
      const filterStore = useFilterStore()
      const expectedFilters = filterStore.filters

      filterStore.toggleFilter({ filterType: 'licenses' })
      expect(warn).toHaveBeenCalledWith(
        'Cannot toggle filter of type licenses. Use code or codeIdx parameter'
      )
      expect(filterStore.filters).toEqual(expectedFilters)
    })

    it.each`
      searchType   | nextSearchType | expectedFilterCount
      ${AUDIO}     | ${IMAGE}       | ${25}
      ${IMAGE}     | ${ALL_MEDIA}   | ${34}
      ${ALL_MEDIA} | ${VIDEO}       | ${12}
      ${VIDEO}     | ${AUDIO}       | ${21}
      ${ALL_MEDIA} | ${IMAGE}       | ${25}
    `(
      'changing searchType clears all but $expectedFilterCount $nextSearchType filters ',
      async ({ searchType, nextSearchType, expectedFilterCount }) => {
        const filterStore = useFilterStore()
        filterStore.setSearchType(searchType)
        // Set all filters to checked
        for (let ft in filterStore.filters) {
          for (let f of filterStore.filters[ft]) {
            filterStore.toggleFilter({ filterType: ft, code: f.code })
          }
        }
        filterStore.setSearchType(nextSearchType)
        await nextTick()

        const checkedFilterCount = Object.keys(filterStore.filters)
          .map(
            (key) => filterStore.filters[key].filter((f) => f.checked).length
          )
          .reduce((partialSum, count) => partialSum + count, 0)
        expect(checkedFilterCount).toEqual(expectedFilterCount)
      }
    )

    /**
     * Changing the search type to ALL_MEDIA does not fire the watcher that clears the filters
     * in tests, but does fire it in the app. TODO: Figure out why???
     */
    it.each`
      searchType   | nextSearchType | expectedFilterCount
      ${AUDIO}     | ${ALL_MEDIA}   | ${34}
      ${IMAGE}     | ${ALL_MEDIA}   | ${34}
      ${ALL_MEDIA} | ${ALL_MEDIA}   | ${34}
      ${VIDEO}     | ${ALL_MEDIA}   | ${34}
    `(
      'changing searchType clears all but $expectedFilterCount ALL_MEDIA filters',
      async ({ searchType, nextSearchType, expectedFilterCount }) => {
        const filterStore = useFilterStore()
        filterStore.setSearchType(searchType)
        // Set all filters to checked
        for (let [fc, filter_items] of Object.entries(filterStore.filters)) {
          for (let f of filter_items) {
            filterStore.toggleFilter({ filterType: fc, code: f.code })
          }
        }
        filterStore.setSearchType(nextSearchType)
        const checkedFilterCount = Object.keys(filterStore.filters)
          .map(
            (key) => filterStore.filters[key].filter((f) => f.checked).length
          )
          .reduce((partialSum, count) => partialSum + count, 0)

        expect(checkedFilterCount).toEqual(expectedFilterCount)
      }
    )

    it('Does not set filter or count filter as applied, and does not raise error for unsupported search types', () => {
      const filterStore = useFilterStore()
      filterStore.toggleFilter({
        filterType: 'licenseTypes',
        code: 'commercial',
      })
      expect(filterStore.isAnyFilterApplied).toEqual(true)

      filterStore.setSearchType(VIDEO)
      filterStore.toggleFilter({
        filterType: 'licenseTypes',
        code: 'commercial',
      })
      expect(filterStore.isAnyFilterApplied).toEqual(false)
    })
  })
})
