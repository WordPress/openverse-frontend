<template>
  <MetaSearchForm
    id="tab-audio"
    type="audio"
    role="tabpanel"
    aria-labelledby="audio"
  />
</template>

<script>
export default {
  name: 'AudioSearch',
  head() {
    return {
      title: this.$t('seo.titles.search', {
        media: this.$t('media-types.audio'),
        query: this.$store.state.query.q,
      }),
    }
  },
}
</script>
