<template>
  <div v-if="tags && tags.length" class="media_tags">
    <h3 v-if="showHeader" class="b-header">
      {{ header }}
    </h3>
    <ul class="flex gap-2">
      <MediaTag
        v-for="(tag, index) in getValidTags()"
        :key="index"
        tag="li"
        @click="searchByTagName"
        >{{ tag.name }}</MediaTag
      >
    </ul>
  </div>
</template>

<script>
import { UPDATE_QUERY } from '~/constants/action-types'
import { SEARCH } from '~/constants/store-modules'
import { mapActions } from 'vuex'

export default {
  name: 'VAudioTags',
  props: ['tags', 'header'],
  computed: {
    showHeader() {
      return this.$props.header !== ''
    },
  },
  methods: {
    ...mapActions(SEARCH, { setSearchTerm: UPDATE_QUERY }),
    isClarifaiTag(provider) {
      return provider === 'clarifai'
    },
    searchByTagName(query) {
      this.setSearchTerm({ q: query })
    },
    getValidTags() {
      return this.$props.tags.filter((tag) => !!tag.name)
    },
  },
}
</script>
