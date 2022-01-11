<template>
  <div class="app grid h-screen overflow-hidden">
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <VHeader />
    <main
      ref="mainRef"
      class="main embedded overflow-x-hidden"
      :class="{ 'has-sidebar': isSidebarVisible }"
    >
      <Nuxt ref="mainContentRef" class="min-w-0 main-page" />
      <VSidebarTarget class="sidebar" />
    </main>
    <VModalTarget class="modal" />
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'

import { NAV } from '~/constants/store-modules'
import {
  computed,
  provide,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'
import { isMinScreen } from '~/composables/use-media-query'
import { useMatchSearchRoutes } from '~/composables/use-match-routes'
import { useScroll } from '~/composables/use-scroll'

import MigrationNotice from '~/components/MigrationNotice.vue'
import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'
import VHeader from '~/components/VHeader/VHeader.vue'
import VModalTarget from '~/components/VModal/VModalTarget.vue'
import VSidebarTarget from '~/components/VModal/VSidebarTarget.vue'

const embeddedPage = {
  name: 'embedded',
  components: {
    MigrationNotice,
    TranslationStatusBanner,
    VHeader,
    VModalTarget,
    VSidebarTarget,
  },
  layout: 'embedded',
  mixins: [iframeHeight],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  setup() {
    const mainContentRef = ref(null)
    const mainRef = ref(null)
    const { store } = useContext()
    const isReferredFromCc = store.state[NAV].isReferredFromCc

    const { isVisible: isFilterVisible } = useFilterSidebarVisibility()
    const isMdScreen = isMinScreen('md')
    const { matches: isSearchRoute } = useMatchSearchRoutes()

    const isSidebarVisible = computed(
      () => isSearchRoute.value && isMdScreen.value && isFilterVisible.value
    )

    const isHeaderScrolled = ref(false)
    const scrollY = ref(0)
    const { isScrolled: isMainContentScrolled, y: mainContentY } =
      useScroll(mainContentRef)
    const { isScrolled: isMainScrolled, y: mainY } = useScroll(mainRef)
    watch(
      [isMainContentScrolled, isMainScrolled],
      ([isMainContentScrolled, isMainScrolled]) => {
        isHeaderScrolled.value = isSidebarVisible.value
          ? isMainContentScrolled
          : isMainScrolled
      }
    )
    watch([mainContentY, mainY], ([mainContentY, mainY]) => {
      scrollY.value = isSidebarVisible.value ? mainContentY : mainY
    })
    const showScrollButton = computed(() => scrollY.value > 70)

    provide('isHeaderScrolled', isHeaderScrolled)
    provide('showScrollButton', showScrollButton)
    return {
      isReferredFromCc,
      isSidebarVisible,
      mainContentRef,
      mainRef,
    }
  },
}
export default embeddedPage
</script>
<style lang="scss" scoped>
.app {
  grid-template-rows: auto 1fr;
  --header-height: 81px;
}
.main {
  margin-top: var(--header-height);
}

.main:not(.has-sidebar) {
  overflow-y: scroll;
}
.main.has-sidebar {
  display: grid;
  overflow: hidden;
  grid-template-columns: 1fr 316px;
}
.main.has-sidebar > * {
  height: 100%;
  overflow-y: scroll;
}
.main-page,
.modal {
  /* Works on Firefox */
  scrollbar-width: thin;
  scrollbar-color: white transparent;
}
@media (min-width: 768px) {
  .main,
  .main-page,
  .modal {
    scrollbar-color: transparent transparent;
  }
  .main:hover,
  .main-page:hover,
  .modal:hover {
    scrollbar-color: #eae9ea transparent;
  }
}

.sidebar {
  scrollbar-color: #eae9ea #f3f2f2;
}
/* Works on Chrome, Edge, and Safari */
.main-page::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 0.5rem;
}
.main-page::-webkit-scrollbar-track {
  background-color: white;
}
.main-page::-webkit-scrollbar-thumb {
  background-color: #6f6e6e;
  border-radius: 0.25rem;
}
.main::-webkit-scrollbar {
  background-color: white;
  width: 0.5rem;
}
.main::-webkit-scrollbar-track {
  background-color: white;
}
.main::-webkit-scrollbar-thumb {
  background-color: #6f6e6e;
  border-radius: 0.25rem;
}
.sidebar::-webkit-scrollbar {
  background-color: #f3f2f2;
  width: 0.5rem;
}
.sidebar::-webkit-scrollbar-thumb {
  background-color: #6f6e6e;
  border-radius: 0.25rem;
  color: #3e58e1;
}
</style>
