<template>
  <VAllResultsGrid />
</template>

<script lang="ts">
import { defineComponent, useMeta } from "@nuxtjs/composition-api"

import { propTypes } from "~/pages/search/search-page.types"

import VAllResultsGrid from "~/components/VAllResultsGrid/VAllResultsGrid.vue"

export default defineComponent({
  name: "SearchIndex",
  components: { VAllResultsGrid },
  props: propTypes,
  setup(props) {
    useMeta({
      title: `${props.searchTerm} | Openverse`,
      meta: [{ hid: "robots", name: "robots", content: "all" }],
    })
  },
  head: {},
})
</script>
