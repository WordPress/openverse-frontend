<template>
  <!-- We 'disable' the link when there are 0 results by  setting aria-disabled. -->
  <VLink
    v-if="hasResults"
    :href="to"
    role="link"
    class="flex w-full flex-col items-start overflow-hidden rounded-sm border border-dark-charcoal/20 bg-white py-4 text-dark-charcoal ps-4 pe-12 hover:bg-dark-charcoal hover:text-white hover:no-underline focus:border-tx focus:outline-none focus-visible:ring focus-visible:ring-pink md:flex-row md:items-center md:justify-between md:p-6"
    @keydown.native.shift.tab.exact="$emit('shift-tab', $event)"
  >
    <slot />
  </VLink>
  <div
    v-else
    class="flex w-full cursor-not-allowed flex-col items-start overflow-hidden rounded-sm border border-dark-charcoal/20 bg-white py-4 text-dark-charcoal/40 ps-4 pe-12 md:flex-row md:items-center md:justify-between md:p-6"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { defineEvent } from '~/types/emits'

import VLink from '~/components/VLink.vue'

export default defineComponent({
  name: 'VContentLinkWrapper',
  components: { VLink },
  props: {
    /**
     * The number of results that the search returned. The link
     * will be disabled if this value is zero.
     */
    resultsCount: {
      type: Number,
      required: true,
    },
    /**
     * The route target of the link.
     */
    to: {
      type: String,
      required: true,
    },
  },
  emits: {
    'shift-tab': defineEvent<[KeyboardEvent]>(),
  },
  setup(props) {
    const hasResults = computed(() => props.resultsCount > 0)

    return {
      hasResults,
    }
  },
})
</script>
