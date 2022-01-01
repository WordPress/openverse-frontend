<template>
  <div
    class="py-8 px-10 search-filters h-auto max-h-screen overflow-y-scroll"
    :class="{
      'bg-dark-charcoal-06 border-dark-charcoal-20': isMdScreen,
    }"
    data-testid="filters-list"
    @onUpdateFilter="onUpdateFilter"
    @onToggleSearchGridFilter="$emit('close')"
    @onClearFilters="clearFilters"
  >
    <div class="flex items-center justify-between mt-4 mb-8">
      <h4 class="text-2xl">
        {{ $t('filter-list.filter-by') }}
      </h4>
      <button
        v-if="isAnyFilterApplied"
        id="clear-filter-button"
        type="button"
        class="text-sm py-2 px-4 text-pink hover:border-dark-gray"
        @click="clearFilters"
      >
        {{ $t('filter-list.clear') }}
      </button>
    </div>
    <form class="filters-form">
      <VFilterChecklist
        v-for="filterType in filterTypes"
        :key="filterType"
        :options="filters[filterType]"
        :title="filterTypeTitle(filterType)"
        :filter-type="filterType"
        @filterChanged="onUpdateFilter"
      />
    </form>
    <footer v-if="isAnyFilterApplied" class="flex justify-between">
      <button
        class="text-sm py-4 px-6 lowercase rounded bg-trans-blue text-white lg:hidden hover:bg-trans-blue-action"
        type="button"
        @click="$emit('close')"
      >
        {{ $t('filter-list.show') }}
      </button>
    </footer>
  </div>
</template>

<script>
import { computed, useContext } from '@nuxtjs/composition-api'
import { kebabize } from '~/utils/format-strings'

import { CLEAR_FILTERS, TOGGLE_FILTER } from '~/constants/action-types'
import { SEARCH } from '~/constants/store-modules'
import { isMinScreen } from '~/composables/use-media-query'

import VFilterChecklist from '~/components/VFilters/VFilterChecklist.vue'

export default {
  name: 'VSearchGridFilter',
  components: {
    VFilterChecklist,
  },
  setup() {
    const { i18n, store } = useContext()
    const isMdScreen = isMinScreen('md')

    const isAnyFilterApplied = computed(
      () => store.getters[`${SEARCH}/isAnyFilterApplied`]
    )
    const filters = computed(() => {
      return store.getters[`${SEARCH}/mediaFiltersForDisplay`] || {}
    })
    const filterTypes = computed(() => Object.keys(filters.value))
    const filterTypeTitle = (filterType) => {
      if (filterType === 'searchBy') {
        return ''
      }
      return i18n.t(`filters.${kebabize(filterType)}.title`)
    }
    const onUpdateFilter = ({ code, filterType }) => {
      store.dispatch(`${SEARCH}/${TOGGLE_FILTER}`, { code, filterType })
    }
    const clearFilters = () => {
      store.dispatch(`${SEARCH}/${CLEAR_FILTERS}`)
    }

    return {
      isAnyFilterApplied,
      filters,
      filterTypes,
      filterTypeTitle,
      clearFilters,
      onUpdateFilter,
      isMdScreen,
    }
  },
}
</script>

<style lang="scss" scoped>
.search-filters {
  /* Works on Firefox */
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
  /* Works on Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 20px;
  }
}
@media (min-width: 768px) {
  .search-filters {
    border-left-width: 1px;
    border-right-width: 1px;
  }
}
</style>
