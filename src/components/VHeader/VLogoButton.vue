<template>
  <VButton
    as="VLink"
    href="/"
    :aria-label="$t('header.home-link')"
    variant="plain"
    size="disabled"
    class="max-w-min text-dark-charcoal hover:bg-yellow"
  >
    <VLogoLoader
      :status="isFetching ? 'loading' : 'idle'"
      :auto-resize="autoResizeLogo"
    />
    <svg
      v-show="!isHeaderScrolled"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95 15"
      aria-hidden="true"
      focusable="false"
      class="-ml-1 mt-1 me-3"
      :class="{
        'hidden sm:block md:hidden': isSearchRoute,
      }"
      width="95"
      height="15"
    >
      <use :href="`${OpenverseLogoText}#icon`" />
    </svg>
  </VButton>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'
import VButton from '~/components/VButton.vue'

import OpenverseLogoText from '~/assets/icons/openverse-logo-text.svg'

export default defineComponent({
  components: { VLogoLoader, VButton },
  props: {
    isFetching: {
      type: Boolean,
      default: false,
    },
    isHeaderScrolled: {
      type: Boolean,
      default: false,
    },
    isSearchRoute: {
      type: Boolean,
      default: false,
    },
    autoResizeLogo: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      OpenverseLogoText,
    }
  },
})
</script>
