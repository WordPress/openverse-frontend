<template>
  <FiltersList
    :class="{
      'search-filters': true,
      visible: isFilterVisible,
    }"
    @onUpdateFilter="onUpdateFilter"
    @onToggleSearchGridFilter="onToggleSearchGridFilter"
    @onClearFilters="onClearFilters"
  />
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { SET_FILTER_IS_VISIBLE } from '~/constants/mutation-types'
import { TOGGLE_FILTER, RESET_FILTERS } from '~/constants/action-types'
import { FILTER } from '~/constants/store-modules'

export default {
  name: 'SearchGridFilter',
  computed: {
    ...mapState({
      filters: (state) => state.filter.filters,
      isFilterVisible: (state) => state.filter.visible,
    }),
    /**
     * Show filters expanded by default
     * @todo: The A/B test is over and we're going with the expanded view. Can remove a lot of this old test logic
     */

    filtersExpandedByDefault() {
      return true
    },
  },
  methods: {
    ...mapActions({
      toggleFilter: `${FILTER}/${TOGGLE_FILTER}`,
      resetFilters: `${FILTER}/${RESET_FILTERS}`,
    }),
    ...mapMutations({
      setFilterVisible: `${FILTER}/${SET_FILTER_IS_VISIBLE}`,
    }),
    onUpdateFilter({ code, filterType }) {
      this.toggleFilter({ code, filterType })
    },
    onClearFilters() {
      this.resetFilters()
    },
    onToggleSearchGridFilter() {
      this.setFilterVisible({
        isFilterVisible: !this.isFilterVisible,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-filters {
  display: none;
  height: auto;
  max-height: 100%;
  overflow-y: scroll;

  label {
    color: #333333;
  }

  @include touch {
    width: 21.875rem;
    max-width: 100%;
    max-height: 37rem;
    overflow-x: hidden;
  }
}

.search-filters.visible {
  display: block;
}
</style>
