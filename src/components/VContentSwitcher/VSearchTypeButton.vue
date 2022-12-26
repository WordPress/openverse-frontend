<template>
  <VButton
    class="group h-12 flex-shrink-0 gap-2"
    :class="showLabel ? 'button-with-label w-auto px-2 ps-3' : 'w-12'"
    variant="action-menu"
    size="disabled"
    :aria-label="$t('search-type.select-label', { type: label })"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icon" />
    <template v-if="showLabel">
      <span class="label label-regular block">{{ label }}</span>
      <span
        v-for="hiddenLabel in otherLabels"
        :key="hiddenLabel"
        class="label label-regular block text-tx"
        aria-hidden="true"
        >{{ hiddenLabel }}</span
      >
      <VIcon
        :class="[
          'caret',
          { 'transition-ease rotate-180': $attrs['aria-expanded'] },
        ]"
        :icon-path="caretDownIcon"
      />
    </template>
  </VButton>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@nuxtjs/composition-api"

import type { SearchType } from "~/constants/media"

import VIcon from "~/components/VIcon/VIcon.vue"
import VButton from "~/components/VButton.vue"

import caretDownIcon from "~/assets/icons/caret-down.svg"

/**
 * This is the content switcher button that appears in the header or the homepage.
 */
export default defineComponent({
  name: "VSearchTypeButton",
  components: { VButton, VIcon },
  props: {
    /**
     * Whether to show the label or only use the icon.
     */
    showLabel: {
      type: Boolean,
      default: false,
    },
    searchType: {
      type: String as PropType<SearchType>,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    otherLabels: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup() {
    return {
      caretDownIcon,
    }
  },
})
</script>
<style scoped>
.button-with-label {
  @apply grid gap-2;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "icon label caret";
}
.label {
  @apply max-w-[175px] truncate;
  grid-area: label;
}
</style>
