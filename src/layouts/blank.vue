<template>
  <div>
    <MigrationNotice v-show="isReferredFromCc" />
    <TranslationStatusBanner />
    <Nuxt ref="mainContentRef" />
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'

import { NAV } from '~/constants/store-modules'
import { useContext } from '@nuxtjs/composition-api'

import MigrationNotice from '~/components/MigrationNotice.vue'
import TranslationStatusBanner from '~/components/TranslationStatusBanner.vue'

const embeddedPage = {
  name: 'embedded',
  components: {
    MigrationNotice,
    TranslationStatusBanner,
  },
  layout: 'embedded',
  mixins: [iframeHeight],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  setup() {
    const { store } = useContext()
    const isReferredFromCc = store.state[NAV].isReferredFromCc

    return { isReferredFromCc }
  },
}
export default embeddedPage
</script>
