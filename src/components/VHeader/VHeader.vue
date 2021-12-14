<template>
  <div
    class="sticky top-0 flex py-4 px-6 md:px-7 align-center justify-between z-40 w-full bg-white"
    :class="{
      'border-b border-dark-charcoal-20':
        isHeaderScrolled || isFilterSidebarVisible,
    }"
  >
    <NuxtLink to="/">
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>
    <VButton
      v-if="!!currentOverlay"
      variant="action-menu"
      class="self-center"
      @click="closeOverlay"
    >
      <span class="text-sr">{{ $t('modal.close') }}</span>
      <VIcon :icon-path="closeIcon" />
    </VButton>
    <VContentSwitcher
      class="flex-grow self-center"
      :route="route"
      :is-header-scrolled="isHeaderScrolled"
      :is-md-screen="isMdScreen"
      :is-search="isSearch"
    />
    <VFilterButton
      v-if="isSearch"
      :is-header-scrolled="isHeaderScrolled"
      :pressed="isFilterSidebarVisible"
      @toggle="toggleFilterVisibility"
    />
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

import closeIcon from '~/assets/icons/close.svg'

import VContentSwitcher from '~/components/VHeader/VContentSwitcher.vue'
import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VContentSwitcher,
    VFilterButton,
    VIcon,
    VLogoLoader,
  },
  setup() {
    const { store } = useContext()
    const { isSearch, route } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()
    const isMdScreen = isMinScreen('md')
    const { isFilterSidebarVisible, setFilterSidebarVisibility } =
      useFilterSidebarVisibility({ mediaQuery: isMdScreen })

    /**
     * Set the active mobile menu view to the 'filters'
     * if the filter sidebar has been toggled open.
     */
    watch(
      () => isFilterSidebarVisible.value,
      (isVisible) => {
        if (isVisible) {
          setCurrentOverlay('filters')
        } else {
          closeOverlay()
        }
      }
    )
    const toggleFilterVisibility = () => {
      setFilterSidebarVisibility(!isFilterSidebarVisible.value)
    }

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
      isSearch,
      isFilterSidebarVisible,
      route,

      toggleFilterVisibility,
      setCurrentOverlay,
      closeOverlay,
    }
  },
})

export default VHeader
</script>
