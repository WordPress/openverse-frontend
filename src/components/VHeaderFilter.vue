<template>
  <VFilterModal ref="modalRef" :label="$t('header.filter-button.simple')">
    <template #trigger="{ a11yProps, visible }">
      <VFilterButton
        v-show="!isMdScreen && !visible"
        :is-header-scrolled="isHeaderScrolled"
        :pressed="visible"
        v-bind="a11yProps"
        @toggle="toggleFilterVisibility"
      />
    </template>

    <VSearchGridFilter @close="closeFilter" />
  </VFilterModal>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'
import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VSearchGridFilter from '~/components/VFilters/VSearchGridFilter.vue'
import VFilterModal from '~/components/VFilters/VFilterModal.vue'

export default {
  name: 'VHeaderFilter',
  components: {
    VFilterButton,
    VFilterModal,
    VSearchGridFilter,
  },
  props: {
    isHeaderScrolled: {
      type: Boolean,
      required: true,
    },
    isMdScreen: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const modalRef = ref(null)

    const filterSidebar = useFilterSidebarVisibility()
    const toggleFilterVisibility = () => {
      filterSidebar.setVisibility(!filterSidebar.isVisible.value)
    }
    /**
     * Syncs the modal state with the filter state on the 'close' button click.
     */
    const closeFilter = () => {
      filterSidebar.setVisibility(false)
      if (modalRef.value) {
        modalRef.value.close()
      }
    }
    return {
      modalRef,
      closeFilter,
      toggleFilterVisibility,
    }
  },
}
</script>

<style scoped></style>
