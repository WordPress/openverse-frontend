<template>
  <div>
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

      <div ref="mobileDrawerTriggerRef">
        <VFilterButton
          :is-header-scrolled="isHeaderScrolled"
          :pressed="isFilterSidebarVisible || mobileDrawer === 'filters'"
          v-bind="triggerA11yProps"
          @toggle="
            mobileDrawer === null
              ? openMobileDrawer('filters')
              : closeMobileDrawer()
          "
        />
      </div>
    </div>

    <!-- Mobile Drawer -->

    <!-- Filter Sidebar -->
    <Component
      :is="filterComponent"
      v-bind="options"
      @close="closeMobileDrawer"
    >
      <VSearchGridFilter @close="closeMobileDrawer" />
    </Component>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  // inject,
  onMounted,
  provide,
  reactive,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'
import { isMinScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import closeIcon from '~/assets/icons/close.svg'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VModalContent from '~/components/VModal/VModalContent.vue'
import VSidebarContent from '~/components/VHeader/VSidebarContent.vue'
import VSearchGridFilter from '~/components/VFilters/VSearchGridFilter.vue'

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VFilterButton,
    VLogoLoader,
    VSearchGridFilter,
  },
  setup() {
    const { store, i18n } = useContext()
    const { isSearch } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()

    const filterSidebar = useFilterSidebarVisibility()
    const isFilterSidebarVisible = computed(() => filterSidebar.isVisible.value)

    const isMdScreen = isMinScreen('md')
    provide('isHeaderScrolled', isHeaderScrolled)
    provide('isMdScreen', isMdScreen)

    /**
     * The state of the mobile drawer/popover menu.
     * Either closed or set as a string to show a particular section.
     * @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>}
     **/
    const mobileDrawer = ref(null)

    /** @type {import('@nuxtjs/composition-api').Ref<import('@nuxtjs/composition-api').Component>} */
    const filterComponent = ref(VModalContent)

    /**
     *
     * @param {'filters'|'content-switcher'} menu
     */
    const openMobileDrawer = (menu) => {
      mobileDrawer.value = menu
    }

    const closeMobileDrawer = () => {
      mobileDrawer.value = null
    }
    /**  @type {import('@nuxtjs/composition-api').ComputedRef<boolean>} */
    const isFetching = computed(() => {
      return store.getters['media/fetchState'].isFetching
    })

    // Mobile drawer menu stuff
    const mobileDrawerTriggerRef = ref(null)

    const triggerA11yProps = reactive({
      'aria-expanded': false,
      'aria-haspopup': 'dialog',
    })
    const { lock, unlock } = useBodyScrollLock({ mobileDrawerTriggerRef })

    watch([mobileDrawer], ([mobileDrawer]) => {
      const visible = mobileDrawer !== null
      triggerA11yProps['aria-expanded'] = visible
      filterSidebar.setVisibility(visible)
      if (isMdScreen) return
      visible ? lock() : unlock()
    })

    const mobileOptions = {
      visible: computed(() => mobileDrawer.value !== null),
      'trigger-element': computed(() => mobileDrawerTriggerRef?.value),
      hide: closeMobileDrawer,
      'aria-label': i18n.t('header.filter-button.simple'),
      mode: 'mobile',
    }

    const desktopOptions = {
      to: 'sidebar',
      visible: computed(() => mobileDrawer.value !== null),
    }

    /**
     * @type {Ref<{'trigger-element'?: ComputedRef<HTMLElement|null>,
     * hide?: close, visible: ComputedRef<boolean>,
     * 'aria-label'?: string,
     * to?: string, mode?: string}>}
     */
    const options = ref(mobileOptions)
    onMounted(() => {
      if (isMdScreen.value && filterSidebar.isVisible.value) {
        open()
      }
    })

    watch(
      [isMdScreen],
      ([isMdScreen]) => {
        if (isMdScreen) {
          console.log('desktop!')
          filterComponent.value = VSidebarContent
          options.value = desktopOptions
        } else {
          console.log('mobile!')
          filterComponent.value = VModalContent
          options.value = mobileOptions
        }
      },
      { immediate: true }
    )

    return {
      closeIcon,
      isFetching,
      isHeaderScrolled,
      isMdScreen,
      isSearch,
      isFilterSidebarVisible,

      // Mobile drawer state
      mobileDrawer,
      closeMobileDrawer,
      openMobileDrawer,
      triggerA11yProps,
      filterComponent,
      options,
    }
  },
})

export default VHeader
</script>
