<template>
  <VButton
    size="disabled"
    class="group flex h-12 w-12 flex-shrink-0 rotate-90 items-center justify-center bg-tx active:shadow-ring"
    variant="plain--avoid"
    :aria-label="$t('header.back-button')"
    @click="$emit('click')"
  >
    <span
      class="flex h-8 w-8 items-center justify-center rounded-sm bg-dark-charcoal-10 group-focus-visible:ring group-focus-visible:ring-pink"
    >
      <VIcon
        class="bg-red pointer-events-none rounded-sm bg-dark-charcoal-10"
        :icon-path="caretDownIcon"
      />
    </span>
  </VButton>
</template>

<script lang="ts">
import { defineEvent } from '~/types/emits'

import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

import caretDownIcon from '~/assets/icons/caret-down.svg'

export default {
  name: 'VBackButton',
  components: { VButton, VIcon },
  emits: {
    click: defineEvent(),
  },
  setup() {
    return {
      caretDownIcon,
    }
  },
}
</script>
