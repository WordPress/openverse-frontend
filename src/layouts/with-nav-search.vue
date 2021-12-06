<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <VHeader />
    <main class="embedded pt-20">
      <Nuxt />
    </main>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import iframeHeight from '~/mixins/iframe-height'
import i18nSync from '~/mixins/i18n-sync'

import { NAV } from '~/constants/store-modules'
import MigrationNotice from '~/components/MigrationNotice.vue'
import VHeader from '~/components/VHeader/VHeader.vue'

const embeddedWithNavSearch = {
  name: 'embedded-with-nav-search',
  components: {
    MigrationNotice,
    VHeader,
  },
  layout: 'embedded-with-nav-search',
  mixins: [iframeHeight, i18nSync],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  computed: { ...mapState(NAV, ['isReferredFromCc']) },
}
export default embeddedWithNavSearch
</script>
