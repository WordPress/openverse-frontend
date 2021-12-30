<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <VHeader />
    <main class="embedded">
      <Nuxt />
    </main>
    <VModalTarget />
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'

import { NAV } from '~/constants/store-modules'
import { useContext } from '@nuxtjs/composition-api'

import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'
import VHeader from '~/components/VHeader/VHeader.vue'
import VModalTarget from '~/components/VModal/VModalTarget.vue'

const embeddedPage = {
  name: 'embedded',
  components: { VHeader, TranslationStatusBanner, VModalTarget },
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
