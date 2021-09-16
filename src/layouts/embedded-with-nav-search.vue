<template>
  <div class="app">
    <HeaderSection :show-nav-search="true" />
    <main class="embedded">
      <Nuxt />
    </main>
  </div>
</template>
<script>
import iframeHeight from '~/mixins/iframe-height'
import i18nSync from '~/mixins/i18n-sync'

const embeddedWithNavSearch = {
  name: 'embedded-with-nav-search',
  mixins: [iframeHeight, i18nSync],
  layout: 'embedded-with-nav-search',
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
}
export default embeddedWithNavSearch
</script>
