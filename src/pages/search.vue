<template>
  <div class="browse-page">
    <div class="search columns">
      <div class="lg:hidden">
        <AppModal v-if="isFilterVisible" @close="onToggleSearchGridFilter">
          <SearchGridFilter />
        </AppModal>
      </div>
      <aside
        v-if="isFilterVisible"
        class="column is-narrow grid-sidebar is-hidden-touch max-w-full bg-white"
      >
        <SearchGridFilter />
      </aside>
      <div class="column search-grid-ctr">
        <SearchGridForm @onSearchFormSubmit="onSearchFormSubmit" />
        <SearchTypeTabs />
        <FilterDisplay v-if="shouldShowFilterTags" />
        <NuxtChild :key="$route.path" @onLoadMoreItems="onLoadMoreItems" />
        <ScrollButton
          data-testid="scroll-button"
          :show-btn="showScrollButton"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { MEDIA, SEARCH } from '~/constants/store-modules'
import {
  FETCH_MEDIA,
  SET_FILTERS_FROM_URL,
  SET_QUERY,
  SET_SEARCH_TYPE_FROM_URL,
  UPDATE_SEARCH_TYPE,
} from '~/constants/action-types'
import { SET_FILTER_IS_VISIBLE } from '~/constants/mutation-types'
import { ALL_MEDIA, IMAGE } from '~/constants/media'
import {
  queryStringToQueryData,
  queryStringToSearchType,
} from '~/utils/search-query-transform'
import local from '~/utils/local'
import { screenWidth } from '~/utils/get-browser-info'
import debounce from 'lodash.debounce'

const BrowsePage = {
  name: 'browse-page',
  layout({ store }) {
    return store.state.nav.isEmbedded ? 'embedded' : 'default'
  },
  scrollToTop: false,
  async fetch() {
    const url = this.$route.fullPath
    if (process.server) {
      const query = queryStringToQueryData(url)
      this.setQuery({ query })
    }
    await this.setSearchTypeFromUrl({ url, path: this.$route.path })
    await this.setFiltersFromUrl({ url, query: this.$route.query })
  },
  data: () => ({
    showScrollButton: false,
  }),
  created() {
    this.debounceScrollHandling = debounce(this.checkScrollLength, 100)
  },
  mounted() {
    const localFilterState = () =>
      local.get(process.env.filterStorageKey)
        ? local.get(process.env.filterStorageKey) === 'true'
        : true

    const MIN_SCREEN_WIDTH_FILTER_VISIBLE_BY_DEFAULT = 800
    const isDesktop = () =>
      screenWidth() > MIN_SCREEN_WIDTH_FILTER_VISIBLE_BY_DEFAULT
    this.setFilterVisibility({
      isFilterVisible: isDesktop() ? localFilterState() : false,
    })
    window.addEventListener('scroll', this.debounceScrollHandling)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.debounceScrollHandling)
  },
  computed: {
    ...mapState(SEARCH, ['query', 'isFilterVisible', 'searchType']),
    ...mapGetters(SEARCH, ['searchQueryParams']),
    mediaType() {
      // Default to IMAGE until media search/index is generalized
      return this.searchType !== ALL_MEDIA ? this.searchType : IMAGE
    },
  },
  methods: {
    ...mapActions(MEDIA, { fetchMedia: FETCH_MEDIA }),
    ...mapActions(SEARCH, {
      setSearchTypeFromUrl: SET_SEARCH_TYPE_FROM_URL,
      setFiltersFromUrl: SET_FILTERS_FROM_URL,
      updateSearchType: UPDATE_SEARCH_TYPE,
      setQuery: SET_QUERY,
    }),
    ...mapMutations(SEARCH, {
      setFilterVisibility: SET_FILTER_IS_VISIBLE,
    }),
    getMediaItems(params, mediaType) {
      this.fetchMedia({ ...params, mediaType })
    },
    onLoadMoreItems(searchParams) {
      this.getMediaItems(searchParams, this.mediaType)
    },
    onSearchFormSubmit(searchParams) {
      this.setQuery(searchParams)
    },
    onToggleSearchGridFilter() {
      this.setFilterVisibility({
        isFilterVisible: !this.isFilterVisible,
      })
    },
    shouldShowFilterTags() {
      return (
        this.$route.path === '/search/' || this.$route.path === '/search/image'
      )
    },
    checkScrollLength() {
      this.showScrollButton = window.scrollY > 70
    },
  },
  watch: {
    query: {
      deep: true,
      handler() {
        console.log('[query watch]', this.searchQueryParams)
        const newPath = this.localePath({
          path: this.$route.path,
          query: this.searchQueryParams,
        })
        this.$router.push(newPath)
        this.getMediaItems(this.query, this.mediaType)
      },
    },
    $route(route) {
      const searchType = queryStringToSearchType(route.path)
      this.updateSearchType({ searchType })
    },
  },
}

export default BrowsePage
</script>

<style lang="scss" scoped>
.search {
  margin: 0;
}
.search-grid-ctr {
  background-color: $color-wp-gray-0;
  min-height: 600px;
  padding: 0;

  @include mobile {
    width: 100%;
    flex: none;
  }
}
.grid-sidebar {
  padding: 0;
  border-right: 1px solid $color-transition-gray;
  width: 21.875rem;
}
</style>
