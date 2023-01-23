<template>
  <section>
    <header class="mb-2 text-sm font-semibold">
      {{ $t("filters.safe-browsing-filter.title") }}
    </header>
    <p class="text-sm font-normal leading-4">
      {{ $t("filters.safe-browsing-filter.description") }}
    </p>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({
  name: "VSafeBrowsingFilter",
})
</script>

<style scoped></style>
