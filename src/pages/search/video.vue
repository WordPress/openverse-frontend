<template>
  <MetaSearchForm
    id="type-video"
    type="video"
    role="tabpanel"
    aria-labelledby="video"
  />
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/store-modules/action-types'
import { VIDEO } from '~/constants/media'
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
  async mounted() {
    await this.$store.dispatch(UPDATE_SEARCH_TYPE, { searchType: VIDEO })
  },
}
</script>
