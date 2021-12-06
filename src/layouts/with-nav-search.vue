<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <VHeader />
    <main class="embedded">
      <Nuxt />
    </main>
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'
import { useContext } from '@nuxtjs/composition-api'

import { NAV } from '~/constants/store-modules'

import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'

import MigrationNotice from '~/components/MigrationNotice.vue'
import VHeader from '~/components/VHeader/VHeader.vue'

const embeddedWithNavSearch = {
  name: 'embedded-with-nav-search',
  components: {
    MigrationNotice,
    TranslationStatusBanner
    VHeader,
  },
  layout: 'embedded-with-nav-search',
  mixins: [iframeHeight],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  setup() {
    const { store } = useContext()
    const isReferredFromCc = store.state[NAV].isReferredFromCc

    return {
      isReferredFromCc,
    }
  },
}
export default embeddedWithNavSearch
</script>
