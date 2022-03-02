<template>
  <ul class="buttons">
    <li v-for="source in sources" :key="source.name">
      <VLink :href="source.url" class="button small me-4 is-opaque">
        {{ source.name }}
        <sup class="top-0">
          <i class="ms-2 icon external-link" />
        </sup>
      </VLink>
    </li>
  </ul>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'

import getLegacySourceUrl, {
  legacySourceMap,
} from '~/utils/get-legacy-source-url'

import VLink from '~/components/VLink.vue'

export default {
  name: 'MetaSourceList',
  components: { VLink },
  props: {
    type: { type: String },
    query: { type: Object },
  },
  setup(props) {
    const sources = computed(() =>
      Object.keys(legacySourceMap)
        .filter((sourceName) => legacySourceMap[sourceName][props.type])
        .map((source) => ({
          name: source,
          url: getLegacySourceUrl(props.type)(source, props.query),
        }))
    )

    return {
      sources,
    }
  },
}
</script>
