<template>
  <div
    class="fixed flex px-8 align-center z-40 w-full bg-white"
    :class="{ 'border-b border-dark-charcoal-20': isHeaderScrolled }"
  >
    <NuxtLink to="/">
      <VLogoLoader />
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
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { useWindowScroll } from '~/composables/use-window-scroll'

import closeIcon from '~/assets/icons/close.svg'

import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import { isScreen } from '~/composables/use-media-query'

const HEADER_HEIGHT = 80

const searchRoutes = ['search', 'search-image', 'search-audio', 'search-video']

const VHeader = defineComponent({
  name: 'VHeader',
  components: {
    VIcon,
    VLogoLoader,
  },
  setup() {
    const { y } = useWindowScroll()
    const isHeaderScrolled = computed(() => y.value > HEADER_HEIGHT)

    const isMdScreen = isScreen('md')
    const currentOverlay = ref(null)
    // eslint-disable-next-line no-unused-vars
    const setCurrentOverlay = () => {
      // Overlay can only be set on mobile screen
      if (!isMdScreen.value) return
    }
    const closeOverlay = () => {
      currentOverlay.value = null
    }
    const route = useRoute()
    const router = useRouter()
    const isSearch = ref(route.value.name === 'search')
    router.beforeEach((to, from, next) => {
      isSearch.value = searchRoutes.includes(to.name)
      next()
    })

    return {
      closeIcon,
      closeOverlay,
      currentOverlay,
      isHeaderScrolled,
      isSearch,
    }
  },
})

export default VHeader
</script>
