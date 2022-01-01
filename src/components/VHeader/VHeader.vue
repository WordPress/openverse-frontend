<template>
  <div
    class="sticky top-0 flex py-4 px-6 md:px-7 align-center justify-between z-40 w-full bg-white"
    :class="{
      'border-b border-dark-charcoal-20':
        isHeaderScrolled || currentMenu !== null,
    }"
  >
    <NuxtLink to="/">
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>
    <VHeaderFilter v-if="isSearch" @close="closeMenu" @open="openMenu" />
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  provide,
  ref,
  useContext,
} from '@nuxtjs/composition-api'

import { isMinScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'

import closeIcon from '~/assets/icons/close.svg'

import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VHeaderFilter from '~/components/VHeader/VHeaderFilter.vue'

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VHeaderFilter,
    VLogoLoader,
  },
  setup() {
    const { store } = useContext()
    const { isSearch } = useSearchRoute()
    const { isHeaderScrolled } = useWindowScroll()
    const isMdScreen = isMinScreen('md')
    provide('isHeaderScrolled', isHeaderScrolled)
    provide('isMdScreen', isMdScreen)

    /** @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>} */
    const currentMenu = ref(null)

    /**
     *
     * @param {'filters'|'content-switcher'} menu
     */
    const openMenu = (menu) => {
      currentMenu.value = menu
    }

    const closeMenu = () => {
      currentMenu.value = null
    }
    /**  @type {import('@nuxtjs/composition-api').ComputedRef<boolean>} */
    const isFetching = computed(() => {
      return store.getters['media/fetchState'].isFetching
    })

    return {
      closeIcon,
      currentMenu,
      isFetching,
      isHeaderScrolled,
      isSearch,

      closeMenu,
      openMenu,
    }
  },
})

export default VHeader
</script>
