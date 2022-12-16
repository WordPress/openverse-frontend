<template>
  <li>
    <VLink
      class="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-tx disabled:text-dark-charcoal-40"
      :class="[
        { 'font-semibold': isActive },
        mode === 'light'
          ? 'text-dark-charcoal focus-visible:ring-pink'
          : 'text-white focus-visible:ring-yellow',
      ]"
      show-external-icon
      :href="link"
      @click="$emit('click')"
      ><slot
    /></VLink>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@nuxtjs/composition-api"

import VLink from "~/components/VLink.vue"

export default defineComponent({
  name: "VNavLink",
  components: {
    VLink,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<"light" | "dark">,
      default: "dark",
    },
    link: {
      type: String,
      required: true,
    },
  },
})
</script>
