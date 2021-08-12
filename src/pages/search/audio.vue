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
      title: `Audio results for "${this.$store.state.query.q}" on Openverse`,
    }
  },
}
</script>
