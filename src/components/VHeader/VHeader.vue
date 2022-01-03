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
    <div class="flex flex-row gap-4">
      <VPageMenuButton :a11y-props="a11yProps" />
      <VContentSwitcherButton
        :active-item="activeItem"
        :a11y-props="a11yProps"
        :icon="imageIcon"
      />
    </div>

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
  provide,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'

import { isMinScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import closeIcon from '~/assets/icons/close.svg'
import imageIcon from '~/assets/icons/image-content.svg'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VPageMenuButton from '~/components/VHeader/VContentSwitcher/VPageMenuButton'
import VContentSwitcherButton from '~/components/VHeader/VContentSwitcher/VContentSwitcherButton'

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VFilterButton,
    VLogoLoader,
    VContentSwitcherButton,
    VPageMenuButton,
  },
  setup() {
    const { store } = useContext()
    const { isSearch } = useSearchRoute()
    /** @type { import('@nuxtjs/composition-api').Ref<boolean> } */
    const { isHeaderScrolled } = useWindowScroll()
    /** @type { import('@nuxtjs/composition-api').Ref<boolean> } */
    const isMdScreen = isMinScreen('md')
    const { isFilterSidebarVisible, setFilterSidebarVisibility } =
      useFilterSidebarVisibility({ mediaQuery: isMdScreen })
    provide('isHeaderScrolled', isHeaderScrolled)
    provide('isMdScreen', isMdScreen)

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

    // values set for testing purposes only
    const activeItem = 'image'
    const a11yProps = {
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    }

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

      activeItem,
      a11yProps,
      imageIcon,
    }
  },
})

export default VHeader
</script>
