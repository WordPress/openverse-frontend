<template>
  <aside>
    <h3 class="text-2xl md:text-3xl mb-6">
      {{ $t('image-details.related-images') }}
    </h3>
    <VImageGrid
      :images="media"
      :show-load-more="false"
      :fetch-state="fetchState"
    />
  </aside>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

import { FetchState } from '~/composables/use-fetch-state'

import VImageGrid from '~/components/VImageGrid/VImageGrid.vue'

export default defineComponent({
  name: 'VRelatedImages',
  components: { VImageGrid },
  props: {
    media: {
      type: Array,
      required: true,
    },
    fetchState: {
      type: Object as PropType<FetchState>,
      required: true,
    },
  },
})
</script>
