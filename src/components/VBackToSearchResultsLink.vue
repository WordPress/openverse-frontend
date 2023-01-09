<template>
  <!-- @todo: Separate the absolute container from the link itself. -->
  <VLink
    class="time inline-flex flex-row items-center gap-2 rounded-sm p-2 text-xs font-semibold text-dark-charcoal-70 pe-3 hover:text-dark-charcoal"
    v-bind="$attrs"
  >
    <VIcon :icon-path="chevronIcon" :rtl-flip="true" />
    {{ label }}
  </VLink>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api"

import { useI18n } from "~/composables/use-i18n"

import VIcon from "~/components/VIcon/VIcon.vue"
import VLink from "~/components/VLink.vue"

import chevronIcon from "~/assets/icons/chevron-left.svg"

/**
 * This link takes the user from a single result back to the list of all
 * results. It only appears if the user navigated from the search results.
 */
export default defineComponent({
  components: {
    VIcon,
    VLink,
  },
  inheritAttrs: false,
  props: {
    text: {
      required: false,
      type: String,
    },
  },
  setup(props) {
    const i18n = useI18n()
    const label = ref(props.text ?? i18n.t("single-result.back"))
    return { label, chevronIcon }
  },
})
</script>
