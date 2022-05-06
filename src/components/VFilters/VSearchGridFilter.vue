<template>
  <section
    id="filters"
    aria-labelledby="filters-heading"
    class="filters py-8 px-10 min-h-full md:bg-dark-charcoal-06"
  >
    <div class="flex items-center justify-between mt-2 mb-6">
      <h4 id="filters-heading" class="text-sr font-semibold py-2 uppercase">
        {{ $t('filter-list.filter-by') }}
      </h4>
      <VButton
        v-if="isAnyFilterApplied"
        id="clear-filter-button"
        variant="plain"
        class="text-sm font-semibold py-2 px-4 text-pink hover:ring hover:ring-pink"
        @click="clearFilters"
      >
        {{ $t('filter-list.clear') }}
      </VButton>
    </div>
    <form ref="filtersFormRef" class="filters-form" @keydown="handleKeyDown">
      <VFilterChecklist
        v-for="filterType in filterTypes"
        :key="filterType"
        :options="filters[filterType]"
        :title="filterTypeTitle(filterType)"
        :filter-type="filterType"
        @toggle-filter="toggleFilter"
      />
    </form>
    <footer v-if="isAnyFilterApplied" class="md:hidden flex justify-between">
      <VButton variant="primary" @click="$emit('close')">
        {{ $t('filter-list.show') }}
      </VButton>
    </footer>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import { kebab } from 'case'

import { useSearchStore } from '~/stores/search'
import { areQueriesEqual } from '~/utils/search-query-transform'

import type { NonMatureFilterCategory } from '~/constants/filters'
import { keycodes } from '~/constants/key-codes'
import { Focus, focusIn, getFocusableElements } from '~/utils/focus-management'

import VFilterChecklist from '~/components/VFilters/VFilterChecklist.vue'
import VButton from '~/components/VButton.vue'

export default defineComponent({
  name: 'VSearchGridFilter',
  components: {
    VButton,
    VFilterChecklist,
  },
  setup() {
    const searchStore = useSearchStore()

    const { app, i18n } = useContext()
    const route = useRoute()
    const router = useRouter()

    const filtersFormRef = ref<HTMLFormElement>(null)

    const isAnyFilterApplied = computed(() => searchStore.isAnyFilterApplied)
    const filters = computed(() => searchStore.searchFilters)
    const filterTypes = computed(
      () => Object.keys(filters.value) as NonMatureFilterCategory[]
    )
    const filterTypeTitle = (filterType: string) =>
      filterType === 'searchBy'
        ? ''
        : i18n.t(`filters.${kebab(filterType)}.title`).toString()

    /**
     * This watcher fires even when the queries are equal. We update the path only
     * when the queries change.
     */
    watch(
      () => searchStore.searchQueryParams,
      /**
       * @param {import('~/utils/search-query-transform').ApiQueryParams} newQuery
       * @param {import('~/utils/search-query-transform').ApiQueryParams} oldQuery
       */
      (newQuery, oldQuery) => {
        if (!areQueriesEqual(newQuery, oldQuery)) {
          const newPath = app.localePath({
            path: route.value.path,
            query: searchStore.searchQueryParams,
          })
          router.push(newPath)
        }
      }
    )

    /**
     * Find the last focusable element in VSearchGridFilter to add a 'Tab' keydown event
     * handler to it.
     * We could actually hard-code this because 'searchBy' is always the last now.
     */
    const lastFocusableElement = ref<HTMLElement>(null)
    const updateLastFocusable = () => {
      const focusable = getFocusableElements(filtersFormRef.value)
      lastFocusableElement.value = focusable[focusable.length - 1]
    }
    onMounted(() => {
      updateLastFocusable()
    })
    watch(filterTypes, () => updateLastFocusable())
    /**
     * When the user presses 'Tab' on the last focusable element, we need to
     * move focus to the first focusable element in main.
     * @param event
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === keycodes.Tab &&
        lastFocusableElement.value === event.target
      ) {
        event.preventDefault()
        focusIn(document.querySelector('main'), Focus.First)
      }
    }

    return {
      filtersFormRef,
      isAnyFilterApplied,
      filters,
      filterTypes,
      filterTypeTitle,
      clearFilters: searchStore.clearFilters,
      toggleFilter: searchStore.toggleFilter,
      handleKeyDown,
    }
  },
})
</script>
<style scoped>
.filters {
  border-inline-start: 1px solid transparent;
}
@screen md {
  .filters {
    /* dark-charcoal-20*/
    border-inline-start: 1px solid #d6d4d5;
  }
}
</style>
