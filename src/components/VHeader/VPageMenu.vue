<template>
  <Component
    :is="switcherComponent"
    ref="menuModalRef"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template #page-switcher-button="{ a11yProps }">
      <VPageMenuButton :a11y-props="a11yProps" />
    </template>
    <template #page-switcher-content>
      <VPageMenuPopover />
    </template>
  </Component>
</template>
<script>
import { inject, onMounted, ref, watch } from '@nuxtjs/composition-api'

import VPageMenuButton from '~/components/VHeader/VContentSwitcher/VPageMenuButton.vue'
import VPageMenuPopover from '~/components/VHeader/VContentSwitcher/VPageMenuPopover.vue'
import VMobilePageMenu from '~/components/VHeader/VPageMenu/VMobilePageMenu.vue'
import VDesktopPageMenu from '~/components/VHeader/VPageMenu/VDesktopPageMenu.vue'

export default {
  name: 'VPageMenu',
  components: {
    VPageMenuButton,
    VPageMenuPopover,
    VMobilePageMenu,
    VDesktopPageMenu,
  },
  props: {
    openMenu: {},
  },
  setup() {
    /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */
    const isHeaderScrolled = inject('isHeaderScrolled')
    /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */
    const isMinScreenMd = inject('isMinScreenMd')
    /** @type {import('@nuxtjs/composition-api').Ref<null|HTMLElement>} */
    const menuModalRef = ref(null)

    /**
     * @type {import('@nuxtjs/composition-api').Ref<import('@nuxtjs/composition-api').Component>}
     */
    const switcherComponent = ref(VMobilePageMenu)

    /**
     * Immediate watch breaks the hydration process, so we use onMounted instead for the first
     * check, and if the screen is wider than mobile, use the VDesktopSwitcher.
     */
    watch([isMinScreenMd], ([isMinScreenMd]) => {
      switcherComponent.value = isMinScreenMd
        ? VDesktopPageMenu
        : VMobilePageMenu
    })
    onMounted(() => {
      if (isMinScreenMd.value) {
        switcherComponent.value = VDesktopPageMenu
      }
    })

    return {
      isHeaderScrolled,
      isMinScreenMd,

      switcherComponent,

      menuModalRef,
    }
  },
}
</script>
