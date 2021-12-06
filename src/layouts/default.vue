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
import VHeader from '~/components/VHeader/VHeader.vue'

const embeddedPage = {
  name: 'embedded',
  layout: 'embedded',
  components: {
    VHeader,
  },
  mixins: [iframeHeight, i18nSync],
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
  computed: { ...mapState(NAV, ['isReferredFromCc']) },
}
export default embeddedPage
</script>
