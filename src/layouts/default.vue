<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <VHeader />
    <main class="embedded pt-20">
      <Nuxt />
    </main>
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'
import { useContext } from '@nuxtjs/composition-api'

import { NAV } from '~/constants/store-modules'
import VHeader from '~/components/VHeader/VHeader.vue'
import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'

const embeddedPage = {
  name: 'embedded',
  components: { TranslationStatusBanner, VHeader },
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
