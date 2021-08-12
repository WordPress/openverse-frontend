<template>
  <MetaSearchForm
    id="type-video"
    type="video"
    role="tabpanel"
    aria-labelledby="video"
  />
</template>

<script>
export default {
  name: 'VideoSearch',
  head() {
    return {
      title: this.$t('seo.titles.search', {
        media: this.$t('media-types.video'),
        query: this.$store.state.query.q,
      }),
    }
  },
}
</script>
