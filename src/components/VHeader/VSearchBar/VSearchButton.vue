<template>
  <VIconButton
    v-bind="$attrs"
    size="search"
    class="search-button hover:text-white group-hover:text-white hover:bg-pink group-hover:bg-pink p-0.5px ps-1.5px focus:p-0 border border-s-0 md:border md:border-s-0 border-dark-charcoal-20 hover:border-pink group-hover:border-pink rounded-e-sm active:shadow-ring"
    :icon-props="{ iconPath: searchIcon }"
    :aria-label="$t('search.search')"
    v-on="$listeners"
  />
</template>

<script>
import VIconButton from '~/components/VIconButton/VIconButton.vue'

import searchIcon from '~/assets/icons/search.svg'

export default {
  name: 'VSearchButton',
  components: { VIconButton },
  inheritAttrs: false,
  setup() {
    return { searchIcon }
  },
}
</script>

<style>
/* @todo: Find a better way to override the VIconButton border styles */
.search-button {
  border-width: 1px 1px 1px 0 !important;
}
</style>
