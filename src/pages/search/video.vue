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
      title: `Video results for "${this.$store.state.query.q}" on Openverse`,
    }
  },
}
</script>
