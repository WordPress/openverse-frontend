<template>
  <div
    class="fixed flex px-8 align-center z-40 w-full bg-white"
    :class="{ 'border-b border-dark-charcoal-20': isHeaderScrolled }"
  >
    <NuxtLink to="/">
      <VLogoLoader :status="isFetching ? 'loading' : 'idle'" />
    </NuxtLink>
    <template v-if="!currentOverlay">
      <VFilterButton
        :is-header-scrolled="isHeaderScrolled"
        @overlay-open="setCurrentOverlay('filters')"
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
} from '@nuxtjs/composition-api'

import { isScreen } from '~/composables/use-media-query'
import { useSearchRoute } from '~/composables/use-search-route'
import { useWindowScroll } from '~/composables/use-window-scroll'

import closeIcon from '~/assets/icons/close.svg'

import VFilterButton from '~/components/VHeader/VFilterButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'

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

    /** @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>} */
    const currentOverlay = ref(null)
    /**
     * When an overlay is opened on mobile, this sets the current overlay name
     * @param {'filters'|'content-switcher'} overlay
     */
    // eslint-disable-next-line no-unused-vars
    const setCurrentOverlay = (overlay) => {
      // Overlay can only be set on mobile screen
      if (isMdScreen.value) return
      currentOverlay.value = overlay
    }
    const closeOverlay = () => {
      currentOverlay.value = null
    }

    /**  @type {import('@nuxtjs/composition-api').ComputedRef<Boolean>} */
    const isFetching = computed(
      () => store.getters['media/fetchingState'].isFetching
    )

    return {
      closeIcon,
      currentOverlay,
      isFetching,
      isHeaderScrolled,
      isSearch,

      setCurrentOverlay,
      closeOverlay,
    }
  },
})

export default VHeader
</script>
