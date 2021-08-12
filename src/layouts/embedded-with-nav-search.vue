<template>
  <div class="app">
    <HeaderSection :show-nav-search="true" />
    <main class="embedded">
      <Nuxt />
    </main>
  </div>
</template>
<script>
const embeddedWithNavSearch = {
  name: 'embedded-with-nav-search',
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
          content: this.$t('seo.meta.description'),
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('seo.meta.description'),
        },
        ...i18nHead.meta,
      ],
    }
  },
}
export default embeddedWithNavSearch
</script>
