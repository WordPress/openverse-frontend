<template>
  <div
    class="sticky top-0 flex py-4 px-6 md:px-7 align-center justify-between z-40 w-full bg-white"
    :class="{
      'border-b border-dark-charcoal-20':
        isHeaderScrolled || filterSidebar.isVisible,
    }"
  >
    <NuxtLink to="/">
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>
    <VHeaderFilter
      v-if="isSearch"
      ref="filterRef"
      :is-header-scrolled="isHeaderScrolled"
      :is-md-screen="isMdScreen"
    />
    <VButton
      v-if="currentOverlay !== null"
      variant="action-menu-secondary"
      @click="closeOverlay"
      >{{ $t('modal.close')
      }}<VIcon :size="6" :icon-path="closeIcon" class="ms-2"
    /></VButton>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'

import { isMinScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import closeIcon from '~/assets/icons/close.svg'

import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VIcon from '@/components/VIcon/VIcon.vue'

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VIcon,
    VLogoLoader,
  },
  setup() {
    const { store } = useContext()
    const { isSearch } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()
    const isMdScreen = isMinScreen('md')
    const filterSidebar = useFilterSidebarVisibility()
    const filterRef = ref(null)

    /**
     * Set the active mobile menu view to the 'filters'
     * if the filter sidebar has been toggled open.
     */
    watch(
      () => filterSidebar.isVisible.value,
      (isVisible) => {
        if (isVisible) {
          setCurrentOverlay('filters')
        } else {
          closeOverlay()
        }
      }
    )

    /** @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>} */
    const currentOverlay = ref(null)
    /**
     * When an overlay is opened on mobile, this sets the current overlay name
     * @param {'filters'|'content-switcher'} overlay
     */
    const setCurrentOverlay = (overlay) => {
      // Overlay can only be set on mobile screen
      if (isMdScreen.value) return
      currentOverlay.value = overlay
    }
    const closeOverlay = () => {
      if (currentOverlay.value === 'filters') {
        filterRef.value.closeFilter()
      }
      currentOverlay.value = null
    }

    /**  @type {import('@nuxtjs/composition-api').ComputedRef<boolean>} */
    const isFetching = computed(() => {
      return store.getters['media/fetchState'].isFetching
    })

    return {
      closeIcon,
      currentOverlay,
      isFetching,
      isHeaderScrolled,
      isMdScreen,
      isSearch,
      filterSidebar,
      filterRef,

      setCurrentOverlay,
      closeOverlay,
    }
  },
})

export default VHeader
</script>
