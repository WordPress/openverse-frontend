<template>
  <SearchGrid
    id="tab-image"
    role="tabpanel"
    aria-labelledby="image"
    @onLoadMoreImages="onLoadMoreImages"
  />
</template>

<script>
import { UPDATE_SEARCH_TYPE } from '~/constants/action-types'
import { IMAGE } from '~/constants/media'
import { SEARCH } from '~/constants/store-modules'

export default {
  name: 'ImageSearch',
  async mounted() {
    await this.$store.dispatch(`${SEARCH}/${UPDATE_SEARCH_TYPE}`, {
      searchType: IMAGE,
    })
  },
  methods: {
    onLoadMoreImages(searchParams) {
      this.$emit('onLoadMoreItems', searchParams)
    },
  },
}
</script>
