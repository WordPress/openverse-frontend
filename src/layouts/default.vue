<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <VHeader />
    <main class="embedded">
      <Nuxt />
    </main>
    <VGlobalAudioSection />
  </div>
</template>
<script>
import { useContext } from '@nuxtjs/composition-api'

import MigrationNotice from '~/components/MigrationNotice.vue'
import VHeader from '~/components/VHeader/VHeader.vue'
import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'

import iframeHeight from '~/mixins/iframe-height'
import { NAV } from '~/constants/store-modules'

const embeddedPage = {
  name: 'embedded',
  components: {
    MigrationNotice,
    TranslationStatusBanner,
    VHeader,
  },
  layout: 'embedded',
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
export default embeddedPage
</script>
