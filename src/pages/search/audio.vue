<template>
  <div id="tab-audio" role="tabpanel" aria-labelledby="audio">
    <AudioResultsList :query="query" @onLoadMoreAudios="onLoadMoreAudios" />
    <MetaSearchForm type="audio" :query="query" :supported="true" />
  </div>
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/constants/action-types'
import { AUDIO } from '~/constants/media'
import { SEARCH } from '~/constants/store-modules'

export default {
  name: 'AudioSearch',
  computed: {
    query() {
      return this.$store.state.search.query
    },
  },
  async mounted() {
    await this.$store.dispatch(`${SEARCH}/${UPDATE_SEARCH_TYPE}`, {
      searchType: AUDIO,
    })
  },
  methods: {
    onLoadMoreAudios(searchParams) {
      this.$emit('onLoadMoreItems', searchParams)
    },
  },
}
</script>
