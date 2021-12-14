<template>
  <div class="flex flex-row items-center flex-grow justify-between">
    <VPopover class="mx-4">
      <template #trigger>
        <VPageMenuButton :icons="icons" />
      </template>
      <VPageMenuPopover
        :current-page="currentPage"
        :icons="icons"
        :pages="pages"
      />
    </VPopover>
    <VPopover
      v-if="isSearch"
      class="mx-4"
      @open="toggleContentSwitcherPressed"
      @close="toggleContentSwitcherPressed"
    >
      <template #trigger>
        <VContentSwitcherButton
          :active-item="activeContentType"
          :icons="icons"
          :is-header-scrolled="isHeaderScrolled"
          :pressed="isContentSwitcherPressed"
        />
      </template>
      <VContentTypePopover
        :active-item="activeContentType"
        :content-types="contentTypes"
        :icons="icons"
        @set-active="setActiveContentType"
      />
    </VPopover>
  </div>
</template>
<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'

import VPopover from '~/components/VPopover/VPopover.vue'

import VPageMenuButton from '~/components/VHeader/VPageMenuButton'
import VContentSwitcherButton from '~/components/VHeader/VContentSwitcherButton'
import VPageMenuPopover from '~/components/VHeader/VPageMenuPopover'
import VContentTypePopover from '~/components/VHeader/VContentTypePopover'

const VDesktopContentSwitcher = defineComponent({
  name: 'VDesktopContentSwitcher',
  components: {
    VContentTypePopover,
    VPageMenuPopover,
    VContentSwitcherButton,
    VPageMenuButton,
    VPopover,
  },
  props: {
    route: {
      type: String,
      required: true,
    },
    isHeaderScrolled: {
      type: Boolean,
      default: false,
    },
    isMdScreen: {
      type: Boolean,
      default: false,
    },
    isSearch: {
      type: Boolean,
      required: true,
    },
    pages: {
      required: true,
    },
    icons: {
      required: true,
    },
  },
  setup(props) {
    const {
      setActiveContentType,
      activeContentType,
      contentTypes,
    } = useContentType()

    const isContentSwitcherPressed = ref(false)
    const toggleContentSwitcherPressed = () => {
      isContentSwitcherPressed.value = !isContentSwitcherPressed.value
    }
    return {
      activeContentType,
      setActiveContentType,
      contentTypes,
      currentPage: props.route,
      toggleContentSwitcherPressed,
      isContentSwitcherPressed,
    }
  },
})
export default VDesktopContentSwitcher
</script>
