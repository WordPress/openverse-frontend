<template>
  <div
    class="sticky top-0 flex px-8 align-center z-40 w-full bg-white"
    :class="{
      'border-b border-dark-charcoal-20':
        isHeaderScrolled || isFilterSidebarVisible,
    }"
  >
    <NuxtLink to="/">
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>
    <template v-if="!currentOverlay">
      <VFilterButton
        :is-header-scrolled="isHeaderScrolled"
        :pressed="isFilterSidebarVisible"
        @toggle="toggleFilterVisibility"
      />
    </template>

    <VButton
      v-if="!!currentOverlay"
      variant="action-menu-secondary"
      class="self-center"
      @click="closeOverlay"
    >
      <span class="text-sr">{{ $t('modal.close') }}</span>
      <VIcon :icon-path="closeIcon" />
    </VButton>
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

import { isScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'

import closeIcon from '~/assets/icons/close.svg'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VFilterButton,
    VIcon,
    VLogoLoader,
  },
  setup() {
    const { store } = useContext()
    const { isSearch } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()
    const isMdScreen = isScreen('md')
    const {
      isFilterSidebarVisible,
      setFilterSidebarVisibility,
    } = useFilterSidebarVisibility({ mediaQuery: isMdScreen })

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

      toggleFilterVisibility,
      setCurrentOverlay,
      closeOverlay,
    }
  },
})

export default VHeader
</script>
