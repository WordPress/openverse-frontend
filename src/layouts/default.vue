<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <VHeader />
    <main class="main embedded" :class="{ 'has-sidebar': isSidebarVisible }">
      <Nuxt class="min-w-0" />
      <VSidebarTarget />
    </main>
    <VModalTarget class="modal" />
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'

import { NAV } from '~/constants/store-modules'
import { computed, useContext } from '@nuxtjs/composition-api'
import { useFilterSidebarVisibility } from '@/composables/use-filter-sidebar-visibility'
import { isMinScreen } from '@/composables/use-media-query'

import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'
import VHeader from '~/components/VHeader/VHeader.vue'
import VModalTarget from '~/components/VModal/VModalTarget.vue'
import VSidebarTarget from '@/components/VModal/VSidebarTarget'

const embeddedPage = {
  name: 'embedded',
  components: {
    VHeader,
    TranslationStatusBanner,
    VModalTarget,
    VSidebarTarget,
  },
  layout: 'embedded',
  mixins: [iframeHeight],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  setup() {
    const { store } = useContext()
    const isReferredFromCc = store.state[NAV].isReferredFromCc

    const filterSidebar = useFilterSidebarVisibility()
    const isMdScreen = isMinScreen('md')

    const isSidebarVisible = computed(
      () => filterSidebar.isVisible.value && isMdScreen.value
    )

    return {
      isReferredFromCc,
      isSidebarVisible,
    }
  },
}
export default embeddedPage
</script>
<style lang="scss" scoped>
.app {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
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
.main,
.modal {
  /* Works on Firefox */
  scrollbar-width: thin;
  scrollbar-color: #989397 white;
}
@media (min-width: 768px) {
  .main,
  .modal {
    scrollbar-color: transparent #f3f2f2;
  }

  .main:hover,
  .modal:hover {
    scrollbar-color: #989397 #f3f2f2;
  }
}
/* Works on Chrome, Edge, and Safari */
.main::-webkit-scrollbar {
  width: 12px;
}

.main::-webkit-scrollbar-track {
  background: transparent;
}

.main::-webkit-scrollbar-thumb {
  background-color: #6e686d;
  border-radius: 20px;
}
</style>
