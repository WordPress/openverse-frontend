<template>
  <!-- @todo: Separate the absolute container from the link itself. -->
  <VLink
    class="px-2 pt-1 md:px-6 md:pt-4 md:pb-2 flex flex-row items-center font-semibold text-dark-charcoal text-xs md:text-sr"
    :href="path"
  >
    <Chevron class="-ms-2" />
    {{ $t('single-result.back') }}
  </VLink>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import VLink from '~/components/VLink.vue'

import type { Component } from 'Vue'

import Chevron from '~/assets/icons/chevron-left.svg?inline'

export default defineComponent({
  components: {
    Chevron: Chevron as Component,
    VLink,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
  },
})
</script>
