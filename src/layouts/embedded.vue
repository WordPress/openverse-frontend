<template>
  <div class="app">
    <HeaderSection />
    <main class="embedded">
      <Nuxt />
    </main>
  </div>
</template>
<script>
const embedded = {
  name: 'embedded',
  layout: 'embedded',
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
export default embedded
</script>
