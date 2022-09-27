<template>
  <div
    class="flex flex-col gap-1 rounded-sm border border-dark-charcoal-20 p-4 shadow-el-2"
  >
    <div class="flex flex-row items-center justify-between py-2">
      <!-- Left margin to align with the text of recent searches. -->
      <span class="category ml-2">
        {{ $t('recent-searches.heading') }}
      </span>
      <VButton
        variant="plain"
        size="small"
        class="caption-bold hover:underline"
        @click="handleClear"
      >
        {{ $t('recent-searches.clear') }}
      </VButton>
    </div>

    <VButton
      v-for="(entry, idx) in entries"
      :key="idx"
      variant="plain"
      size="small"
      class="description-regular hover:bg-dark-charcoal-10"
      @click="handleSelect(idx)"
    >
      <div class="w-full py-1 text-left">
        {{ entry }}
      </div>
    </VButton>
  </div>
</template>

<script lang="ts">
import { PropType } from '@nuxtjs/composition-api'

import { defineEvent } from '~/types/emits'

import VButton from '~/components/VButton.vue'

/**
 * List the recent searches of the user allowing them to go back to a previous
 * search. These searches are saved locally and never shared with the server.
 */
export default {
  name: 'VRecentSearches',
  components: { VButton },
  props: {
    /**
     * the list of saved past searches
     */
    entries: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: {
    select: defineEvent<[string]>(),
    clear: defineEvent(),
  },
  setup(props, { emit }) {
    const handleSelect = (idx: number) => {
      emit('select', props.entries[idx])
    }
    const handleClear = () => {
      emit('clear')
    }

    return {
      handleSelect,
      handleClear,
    }
  },
}
</script>
