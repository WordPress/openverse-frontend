<template>
  <Component
    :is="switcherComponent"
    ref="menuModalRef"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template v-if="isMinScreenMd" #page-switcher-button="{ a11yProps }">
      <VPageMenuButton :a11y-props="a11yProps" />
    </template>
    <template #page-switcher-content>
      <VPageMenuPopover />
    </template>
    <template #content-switcher-button="{ a11yProps }">
      <VContentSwitcherButton
        v-show="!hideButtons"
        :icon="icons[content.activeType.value]"
        :active-item="content.activeType.value"
        :a11y-props="a11yProps"
      />
    </template>
    <template #content-switcher-content>
      <VContentTypePopover :icons="icons" @click="handleContentTypeClick" />
    </template>
  </Component>
</template>
<script>
import { inject, onMounted, ref, watch } from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'

import allIcon from '~/assets/icons/all-content.svg'
import audioIcon from '~/assets/icons/audio-content.svg'
import imageIcon from '~/assets/icons/image-content.svg'
import ellipsisIcon from '~/assets/icons/ellipsis.svg'

import VContentSwitcherButton from '~/components/VHeader/VContentSwitcher/VContentSwitcherButton.vue'
import VContentTypePopover from '~/components/VHeader/VContentSwitcher/VContentTypePopover.vue'
import VPageMenuButton from '~/components/VHeader/VContentSwitcher/VPageMenuButton.vue'
import VPageMenuPopover from '~/components/VHeader/VContentSwitcher/VPageMenuPopover.vue'
import VMobileSwitcher from '~/components/VHeader/VContentSwitcher/VMobileSwitcher.vue'
import VDesktopSwitcher from '~/components/VHeader/VContentSwitcher/VDesktopSwitcher.vue'

const icons = {
  all: allIcon,
  audio: audioIcon,
  image: imageIcon,
  ellipsis: ellipsisIcon,
}

export default {
  name: 'VContentSwitcher',
  components: {
    VContentSwitcherButton,
    VContentTypePopover,
    VPageMenuButton,
    VPageMenuPopover,
  },
  props: {
    openMenu: {},
    hideButtons: {},
  },
  setup() {
    /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */
    const isHeaderScrolled = inject('isHeaderScrolled')
    /** @type {import('@nuxtjs/composition-api').Ref<boolean>} */
    const isMinScreenMd = inject('isMinScreenMd')
    /** @type {import('@nuxtjs/composition-api').Ref<null|HTMLElement>} */
    const menuModalRef = ref(null)
    const content = useContentType()

    /**
     * @type {import('@nuxtjs/composition-api').Ref<import('@nuxtjs/composition-api').Component>}
     */
    const switcherComponent = ref(VMobileSwitcher)

    /**
     * Immediate watch breaks the hydration process, so we use onMounted instead for the first
     * check, and if the screen is wider than mobile, use the VDesktopSwitcher.
     */
    watch([isMinScreenMd], ([isMinScreenMd]) => {
      switcherComponent.value = isMinScreenMd
        ? VDesktopSwitcher
        : VMobileSwitcher
    })
    onMounted(() => {
      if (isMinScreenMd.value) {
        switcherComponent.value = VDesktopSwitcher
      }
    })

    const handleContentTypeClick = (val) => {
      content.setActiveType(val)
      menuModalRef.value?.closeMenu()
    }

    return {
      icons,
      isHeaderScrolled,
      isMinScreenMd,

      switcherComponent,
      content,

      handleContentTypeClick,
      menuModalRef,
    }
  },
}
</script>
