<template>
  <MetaSearchForm
    id="type-video"
    type="video"
    role="tabpanel"
    aria-labelledby="video"
  />
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/constants/action-types'
import { VIDEO } from '~/constants/media'
import { SEARCH } from '~/constants/store-modules'

export default {
  name: 'VideoSearch',
  async mounted() {
    await this.$store.dispatch(`${SEARCH}/${UPDATE_SEARCH_TYPE}`, {
      searchType: VIDEO,
    })
  },
}
</script>
