<template>
  <div class="mb-10">
    <ul class="buttons is-centered mt-6 gap-y-2 flex flex-wrap justify-center">
      <li v-for="source in sources" :key="source">
        <VButton
          target="_blank"
          rel="nofollow noreferrer"
          as="VLink"
          :href="getSourceUrl(source)"
          class="button small me-2 is-opaque"
          variant="tertiary"
        >
          {{ source }}
          <VIcon :size="4" class="ms-1" :icon-path="externalLinkIcon" />
        </VButton>
      </li>
    </ul>
  </div>
</template>

<script>
import getLegacySourceUrl, {
  legacySourceMap,
} from '~/utils/get-legacy-source-url'
import VLink from '~/components/VLink.vue'
import externalLinkIcon from '~/assets/icons/external-link.svg'

export default {
  name: 'MetaSourceList',
  components: { VLink },
  props: {
    type: { type: String },
    query: { type: Object },
  },
  setup() {
    return {
      externalLinkIcon,
    }
  },
  data() {
    return {
      sources: Object.keys(legacySourceMap).filter(
        (sourceName) => legacySourceMap[sourceName][this.type]
      ),
    }
  },
  methods: {
    getSourceUrl(source) {
      return getLegacySourceUrl(this.type)(source, this.query)
    },
  },
}
</script>
