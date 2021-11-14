import store, { filterData } from '~/store/search'
import {
  SET_FILTERS_FROM_URL,
  SET_QUERY,
  SET_SEARCH_TYPE_FROM_URL,
  TOGGLE_FILTER,
  UPDATE_QUERY,
  UPDATE_SEARCH_TYPE,
} from '~/constants/action-types'
import {
  SET_FILTER,
  SET_PROVIDERS_FILTERS,
  CLEAR_FILTERS,
  SET_FILTER_IS_VISIBLE,
  REPLACE_FILTERS,
  SET_SEARCH_TYPE,
  UPDATE_FILTERS,
  MUTATE_QUERY,
  RESET_MEDIA,
} from '~/constants/mutation-types'
import { ALL_MEDIA, AUDIO, IMAGE } from '~/constants/media'

describe('Filter Store', () => {
  describe('state', () => {
    it('state contains licenses', () => {
      const defaultState = store.state()

      expect(defaultState.filters.licenses).toEqual(filterData.licenses)
    })

    it('state contains license types', () => {
      const defaultState = store.state()

      expect(defaultState.filters.licenseTypes).toEqual(filterData.licenseTypes)
    })

    it('state contains image types', () => {
      const defaultState = store.state()

      expect(defaultState.filters.imageCategories).toEqual(
        filterData.imageCategories
      )
    })

    it('state contains imageExtensions', () => {
      const defaultState = store.state()

      expect(defaultState.filters.imageExtensions).toEqual(
        filterData.imageExtensions
      )
    })

    it('state contains empty providers list', () => {
      const defaultState = store.state()

      expect(defaultState.filters.imageProviders).toEqual([])
    })

    it('state contains search by author', () => {
      const defaultState = store.state()

      expect(defaultState.filters.searchBy.author).toEqual(
        filterData.searchBy.author
      )
    })

    it('state contains mature', () => {
      const defaultState = store.state()

      expect(defaultState.filters.mature).toEqual(filterData.mature)
    })

    it('state has filter hidden', () => {
      const defaultState = store.state()

      expect(defaultState.isFilterVisible).toBeFalsy()
    })

    it('isFilterVisible should be false when innerWidth property is undefined', () => {
      window.innerWidth = undefined
      const state = store.state()
      expect(state.isFilterVisible).toBeFalsy()
    })
    it('isFilterVisible should be false when window width is less then 800', () => {
      window.innerWidth = 500
      const state = store.state()
      expect(state.isFilterVisible).toBeFalsy()
    })
  })

  describe('mutations', () => {
    let state = null
    let mutations = null
    let getters = null

    beforeEach(() => {
      state = {
        search: {
          searchType: 'image',
          query: { q: 'foo' },
        },
        ...store.state(),
      }
      mutations = store.mutations
      getters = store.getters
    })

    it('MUTATE_QUERY updates state', () => {
      const params = { query: { q: 'foo' } }
      mutations[MUTATE_QUERY](state, params)

      expect(state.query.q).toBe(params.query.q)
    })

    it('SET_SEARCH_TYPE updates the state', () => {
      state.searchType = IMAGE
      mutations[SET_SEARCH_TYPE](state, { searchType: AUDIO })
      expect(state.searchType).toEqual(AUDIO)
    })

    it('SET_FILTER updates license state', () => {
      mutations[SET_FILTER](state, { filterType: 'licenses', codeIdx: 0 })

      expect(state.filters.licenses[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates license type state', () => {
      mutations[SET_FILTER](state, { filterType: 'licenseTypes', codeIdx: 0 })

      expect(state.filters.licenseTypes[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates imageExtensions state', () => {
      mutations[SET_FILTER](state, {
        filterType: 'imageExtensions',
        codeIdx: 0,
      })

      expect(state.filters.imageExtensions[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates image types state', () => {
      mutations[SET_FILTER](state, {
        filterType: 'imageCategories',
        codeIdx: 0,
      })

      expect(state.filters.imageCategories[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates search by creator', () => {
      mutations[SET_FILTER](state, { filterType: 'searchBy', codeIdx: 0 })

      expect(state.filters.searchBy[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates mature', () => {
      mutations[SET_FILTER](state, { filterType: 'mature' })

      expect(state.filters.mature).toBeTruthy()
    })

    it('SET_FILTER toggles mature', () => {
      state.filters.mature = true
      mutations[SET_FILTER](state, { filterType: 'mature' })

      expect(state.filters.mature).toBeFalsy()
    })

    it('SET_FILTER updates aspect ratio', () => {
      mutations[SET_FILTER](state, { filterType: 'aspectRatios', codeIdx: 0 })

      expect(state.filters.aspectRatios[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates size', () => {
      mutations[SET_FILTER](state, { filterType: 'sizes', codeIdx: 0 })

      expect(state.filters.sizes[0].checked).toBeTruthy()
    })

    it('SET_FILTER updates isFilterApplied with provider', () => {
      state.filters.imageProviders = [{ code: 'met', checked: false }]
      mutations[SET_FILTER](state, { filterType: 'imageProviders', codeIdx: 0 })

      expect(getters.isAnyFilterApplied).toBeTruthy()
    })

    it('SET_FILTER updates isFilterApplied with license type', () => {
      mutations[SET_FILTER](state, { filterType: 'licenseTypes', codeIdx: 0 })

      expect(getters.isAnyFilterApplied).toBeTruthy()
    })

    it('SET_FILTER updates mature', () => {
      mutations[SET_FILTER](state, { filterType: 'mature' })

      expect(state.filters.mature).toBeTruthy()
    })

    it('SET_PROVIDERS_FILTERS merges with existing provider filters', () => {
      const existingProviderFilters = [{ code: 'met', checked: true }]

      const providers = [
        { source_name: 'met', display_name: 'Metropolitan' },
        { source_name: 'flickr', display_name: 'Flickr' },
      ]

      state.filters.imageProviders = existingProviderFilters

      mutations[SET_PROVIDERS_FILTERS](state, {
        mediaType: 'image',
        providers: providers,
      })

      expect(state.filters.imageProviders).toEqual([
        { code: 'met', name: 'Metropolitan', checked: true },
        { code: 'flickr', name: 'Flickr', checked: false },
      ])
    })

    it('SET_FILTER_IS_VISIBLE updates state', () => {
      const params = { isFilterVisible: 'bar' }
      mutations[SET_FILTER_IS_VISIBLE](state, params)

      expect(state.isFilterVisible).toBe(params.isFilterVisible)
    })
  })

  describe('actions', () => {
    let state = null
    let commitMock = null
    let dispatchMock = null
    let actions = null
    let context = null

    beforeEach(() => {
      commitMock = jest.fn()
      dispatchMock = jest.fn()
      state = store.state()
      actions = store.actions
      context = {
        commit: commitMock,
        dispatch: dispatchMock,
        rootState: {},
        state: state,
      }
    })

    it('SET_QUERY sets q parameter', () => {
      const params = { query: { q: 'foo' } }
      actions[SET_QUERY](context, params)

      expect(context.commit).toHaveBeenCalledWith(MUTATE_QUERY, {
        query: {
          ...params.query,
          mediaType: IMAGE,
        },
      })
      expect(context.commit).toHaveBeenCalledWith(
        RESET_MEDIA,
        { mediaType: IMAGE },
        { root: true }
      )
    })

    it('SET_QUERY replaces query q parameter', () => {
      const params = { query: { q: 'bar' } }
      context.state.query = {
        q: 'foo',
      }
      actions[SET_QUERY](context, params)

      expect(context.commit).toHaveBeenCalledWith(MUTATE_QUERY, params)
    })

    it('SET_SEARCH_TYPE_FROM_URL sets search type to image', () => {
      const url = '/search/image?q=cat&source=met'
      const path = '/search/image'
      actions[SET_SEARCH_TYPE_FROM_URL](context, { url, path })

      expect(context.commit).toHaveBeenCalledWith(SET_SEARCH_TYPE, {
        searchType: IMAGE,
      })
      expect(context.commit).toHaveBeenCalledWith(UPDATE_FILTERS, {
        searchType: IMAGE,
      })
    })

    it('SET_SEARCH_TYPE_FROM_URL sets search type to ALL_MEDIA if URL param is not set', () => {
      const action = actions[SET_SEARCH_TYPE_FROM_URL]
      action(context, { url: '/search/?q=cat&source=met' })
      const searchType = ALL_MEDIA
      expect(context.commit).toHaveBeenCalledWith(SET_SEARCH_TYPE, {
        searchType,
      })
      expect(context.commit).toHaveBeenCalledWith(UPDATE_FILTERS, {
        searchType,
      })
    })

    it('UPDATE_SEARCH_TYPE sets search type to ALL_MEDIA if URL param is not set', () => {
      const action = actions[UPDATE_SEARCH_TYPE]

      action(context, { searchType: ALL_MEDIA })
      expect(context.commit).toHaveBeenCalledWith(SET_SEARCH_TYPE, {
        searchType: ALL_MEDIA,
      })
      expect(context.commit).toHaveBeenCalledWith(UPDATE_FILTERS, {
        searchType: 'all',
      })
    })

    it('SET_FILTERS_FROM_URL', () => {
      const url =
        'https://wp.org/openverse/search/image?q=cat&license=cc0,by&searchBy=creator&extension=jpg&mature=true&source=met'
      actions[SET_FILTERS_FROM_URL](
        {
          commit: commitMock,
          dispatch: dispatchMock,
          state,
        },
        { url }
      )
      expect(commitMock).toHaveBeenCalledWith(REPLACE_FILTERS, {
        newFilterData: {
          aspectRatios: [
            {
              checked: false,
              code: 'tall',
              name: 'filters.aspect-ratios.tall',
            },
            {
              checked: false,
              code: 'wide',
              name: 'filters.aspect-ratios.wide',
            },
            {
              checked: false,
              code: 'square',
              name: 'filters.aspect-ratios.square',
            },
          ],
          audioCategories: [
            {
              checked: false,
              code: 'music',
              name: 'filters.audio-categories.music',
            },
            {
              checked: false,
              code: 'soundEffects',
              name: 'filters.audio-categories.sound-effects',
            },
            {
              checked: false,
              code: 'podcast',
              name: 'filters.audio-categories.podcast',
            },
          ],
          audioExtensions: [
            {
              checked: false,
              code: 'mp3',
              name: 'filters.audio-extensions.mp3',
            },
            {
              checked: false,
              code: 'ogg',
              name: 'filters.audio-extensions.ogg',
            },
            {
              checked: false,
              code: 'flac',
              name: 'filters.audio-extensions.flac',
            },
          ],
          audioProviders: [],
          durations: [
            { checked: false, code: 'short', name: 'filters.durations.short' },
            {
              checked: false,
              code: 'medium',
              name: 'filters.durations.medium',
            },
            { checked: false, code: 'long', name: 'filters.durations.long' },
          ],
          imageCategories: [
            {
              checked: false,
              code: 'photograph',
              name: 'filters.image-categories.photograph',
            },
            {
              checked: false,
              code: 'illustration',
              name: 'filters.image-categories.illustration',
            },
            {
              checked: false,
              code: 'digitized_artwork',
              name: 'filters.image-categories.digitized-artwork',
            },
          ],
          imageExtensions: [
            {
              checked: true,
              code: 'jpg',
              name: 'filters.image-extensions.jpg',
            },
            {
              checked: false,
              code: 'png',
              name: 'filters.image-extensions.png',
            },
            {
              checked: false,
              code: 'gif',
              name: 'filters.image-extensions.gif',
            },
            {
              checked: false,
              code: 'svg',
              name: 'filters.image-extensions.svg',
            },
          ],
          imageProviders: [],
          licenseTypes: [
            {
              checked: false,
              code: 'commercial',
              name: 'filters.license-types.commercial',
            },
            {
              checked: false,
              code: 'modification',
              name: 'filters.license-types.modification',
            },
          ],
          licenses: [
            { checked: true, code: 'cc0', name: 'filters.licenses.cc0' },
            { checked: false, code: 'pdm', name: 'filters.licenses.pdm' },
            { checked: true, code: 'by', name: 'filters.licenses.by' },
            { checked: false, code: 'by-sa', name: 'filters.licenses.by-sa' },
            { checked: false, code: 'by-nc', name: 'filters.licenses.by-nc' },
            { checked: false, code: 'by-nd', name: 'filters.licenses.by-nd' },
            {
              checked: false,
              code: 'by-nc-sa',
              name: 'filters.licenses.by-nc-sa',
            },
            {
              checked: false,
              code: 'by-nc-nd',
              name: 'filters.licenses.by-nc-nd',
            },
          ],
          mature: true,
          searchBy: [
            {
              checked: true,
              code: 'creator',
              name: 'filters.searchBy.creator',
            },
          ],
          sizes: [
            { checked: false, code: 'small', name: 'filters.sizes.small' },
            { checked: false, code: 'medium', name: 'filters.sizes.medium' },
            { checked: false, code: 'large', name: 'filters.sizes.large' },
          ],
        },
      })
    })

    it('CLEAR_FILTERS resets filters to initial state', async () => {
      state.filters.licenses = [
        { code: 'by', checked: true },
        { code: 'by-nc', checked: true },
        { code: 'by-nd', checked: true },
      ]
      actions[CLEAR_FILTERS]({
        commit: commitMock,
        dispatch: dispatchMock,
        state,
      })
      expect(commitMock).toHaveBeenCalledWith(REPLACE_FILTERS, {
        newFilterData: filterData,
      })
      expect(dispatchMock).toHaveBeenCalledWith(UPDATE_QUERY)
    })

    it('CLEAR_FILTERS sets providers filters checked to false', async () => {
      state.filters.imageProviders = [
        { code: 'met', name: 'Metropolitan', checked: true },
        { code: 'flickr', name: 'Flickr', checked: false },
      ]

      actions[CLEAR_FILTERS]({
        commit: commitMock,
        dispatch: dispatchMock,
        state,
      })
      const expectedFilters = {
        ...state.filters,
        imageProviders: [
          { code: 'met', name: 'Metropolitan', checked: false },
          { code: 'flickr', name: 'Flickr', checked: false },
        ],
      }
      expect(commitMock).toHaveBeenCalledWith(REPLACE_FILTERS, {
        newFilterData: expectedFilters,
      })
      expect(dispatchMock).toHaveBeenCalledWith(UPDATE_QUERY)
    })

    it.each`
      filterType           | code              | idx
      ${'licenses'}        | ${'cc0'}          | ${0}
      ${'licenseTypes'}    | ${'modification'} | ${1}
      ${'imageExtensions'} | ${'svg'}          | ${3}
      ${'imageCategories'} | ${'photograph'}   | ${0}
      ${'searchBy'}        | ${'creator'}      | ${0}
      ${'mature'}          | ${undefined}      | ${-1}
      ${'aspectRatios'}    | ${'tall'}         | ${0}
      ${'sizes'}           | ${'medium'}       | ${1}
    `(
      "TOGGLE_FILTER should set filter '$code' of type '$filterType",
      ({ filterType, code, idx }) => {
        actions[TOGGLE_FILTER](
          { commit: commitMock, dispatch: dispatchMock, state },
          { filterType: filterType, code: code }
        )
        expect(commitMock).toHaveBeenCalledWith(SET_FILTER, {
          filterType: filterType,
          code: code,
          codeIdx: idx,
        })

        expect(dispatchMock).toHaveBeenCalledWith(UPDATE_QUERY)
      }
    )

    it('TOGGLE_FILTER updates mature', () => {
      actions[TOGGLE_FILTER](
        { commit: commitMock, dispatch: dispatchMock, state },
        { filterType: 'mature' }
      )

      expect(commitMock).toHaveBeenCalledWith(SET_FILTER, {
        filterType: 'mature',
        codeIdx: -1,
      })

      expect(dispatchMock).toHaveBeenCalledWith(UPDATE_QUERY)
    })

    it('TOGGLE_FILTER toggles mature', () => {
      state.filters.mature = true
      actions[TOGGLE_FILTER](
        { commit: commitMock, dispatch: dispatchMock, state },
        { filterType: 'mature' }
      )

      expect(commitMock).toHaveBeenCalledWith(SET_FILTER, {
        filterType: 'mature',
        codeIdx: -1,
      })

      expect(dispatchMock).toHaveBeenCalledWith(UPDATE_QUERY)
    })
  })
})
