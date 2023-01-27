<template>
  <section>
    <header class="mb-2 text-sm font-semibold">
      {{ $t("filters.safe-browsing-filter.title") }}
    </header>
    <p class="mb-4 text-sm font-normal leading-4">
      {{ $t("filters.safe-browsing-filter.description") }}
    </p>
    <VToggleSwitch :checked="checked" @change="onValueChange" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api"

import VToggleSwitch from "../VToggleSwitch/VToggleSwitch.vue"

export default defineComponent({
  name: "VSafeBrowsingFilter",
  components: {
    VToggleSwitch,
  },
  props: {
    /**
     * Whether the filter is checked or not.
     *
     * @default false
     */
    checked: {
      type: Boolean,
      default: false,
    },
  },
  setup(__, { emit }) {
    const onValueChange = () => {
      emit("toggle-filter", {
        code: "mature",
        filterType: "mature",
      })
    }

    return {
      onValueChange,
    }
  },
})
</script>

<style scoped></style>
