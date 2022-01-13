<template>
  <VPopover
    ref="pageMenuPopover"
    class="flex mx-2 items-stretch"
    :label="$t('header.aria.menu')"
  >
    <template #trigger="{ a11yProps }">
      <slot name="page-switcher-button" :a11yProps="a11yProps" />
    </template>
    <slot name="page-switcher-content" />
  </VPopover>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

import VPopover from '~/components/VPopover/VPopover.vue'

export default {
  name: 'VDesktopPageMenu',
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
