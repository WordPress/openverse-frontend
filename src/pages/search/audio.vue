<template>
  <div id="tab-audio" role="tabpanel" aria-labelledby="audio">
    <AudioResultsList :query="query" @onLoadMoreAudios="onLoadMoreAudios" />
    <MetaSearchForm type="audio" :query="query" :supported="true" />
  </div>
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/store-modules/action-types'
import { AUDIO } from '~/constants/media'

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
  computed: {
    query() {
      return this.$store.state.query
    },
  },
  async mounted() {
    await this.$store.dispatch(UPDATE_SEARCH_TYPE, { searchType: AUDIO })
  },
  methods: {
    onLoadMoreAudios(searchParams) {
      this.$emit('onLoadMoreItems', searchParams)
    },
  },
}
</script>
