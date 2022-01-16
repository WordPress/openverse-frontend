<template>
  <VPopover
    ref="pageMenuPopover"
    class="flex mx-2 items-stretch"
    :label="$t('header.aria.menu')"
  >
    <template #trigger="{ a11yProps }">
      <VPageMenuButton :a11y-props="a11yProps" />
    </template>
    <VPageMenuPopover />
  </VPopover>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

import VPopover from '~/components/VPopover/VPopover.vue'
import VPageMenuButton from '@/components/VHeader/VPageMenu/VPageMenuButton.vue'
import VPageMenuPopover from '@/components/VHeader/VPageMenu/VPageMenuPopover.vue'

export default {
  name: 'VDesktopPageMenu',
  components: {
    VPageMenuButton,
    VPageMenuPopover,
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
