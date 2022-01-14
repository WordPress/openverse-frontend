<template>
  <div class="flex flex-row items-stretch flex-grow justify-between">
    <VPopover
      ref="pageMenuPopover"
      class="flex mx-4 items-stretch"
      :label="$t('header.aria.menu')"
    >
      <template #trigger="{ a11yProps }">
        <slot name="page-switcher-button" :a11yProps="a11yProps" />
      </template>
      <slot name="page-switcher-content" />
    </VPopover>
    <VPopover
      ref="contentMenuPopover"
      class="flex mx-4 items-stretch"
      :label="$t('search-type.label')"
    >
      <template #trigger="{ a11yProps }">
        <slot name="content-switcher-button" :a11yProps="a11yProps" />
      </template>
      <slot name="content-switcher-content" />
    </VPopover>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

import VPopover from '~/components/VPopover/VPopover.vue'

export default {
  name: 'VDesktopSwitcher',
  components: {
    VPopover,
  },
  setup() {
    const contentMenuPopover = ref(null)

    /**
     * Only the contentMenuPopover needs to be closed programmatically
     */
    const closeMenu = () => {
      if (contentMenuPopover.value) {
        contentMenuPopover.value.close()
      }
    }

    return {
      contentMenuPopover,
      closeMenu,
    }
  },
}
</script>
