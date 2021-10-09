<template>
  <div class="app">
    <MigrationNotice v-show="isReferredFromCc" />
    <HeaderSection />
    <main class="embedded">
      <Nuxt />
    </main>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import iframeHeight from '~/mixins/iframe-height'
import i18nSync from '~/mixins/i18n-sync'

const embeddedPage = {
  name: 'embedded',
  layout: 'embedded',
  mixins: [iframeHeight, i18nSync],
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
    return {
      htmlAttrs: { ...i18nHead.htmlAttrs },
      link: [...i18nHead.link],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.descriptions.default'),
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('seo.descriptions.default'),
        },
        ...i18nHead.meta,
      ],
    }
  },
  computed: { ...mapState('nav', ['isReferredFromCc']) },
}
export default embeddedPage
</script>
