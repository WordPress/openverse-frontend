<template>
  <section>
    <header class="mb-2 text-sm font-semibold">
      {{ $t("filters.safe-browsing-filter.title") }}
    </header>
    <p class="mb-4 text-sm font-normal leading-4">
      {{ $t("filters.safe-browsing-filter.description") }}
    </p>
    <VToggleSwitch />
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
})
</script>

<style scoped></style>
