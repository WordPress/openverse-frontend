<template>
  <div
    v-show="!isOverlayOpen"
    class="flex flex-row items-center flex-grow justify-between"
  >
    <VPageMenuButton :icons="icons" @click="handleClick" />
    <VContentSwitcherButton
      v-if="isSearch"
      :active-item="activeContentType"
      :icons="icons"
      :is-header-scrolled="isHeaderScrolled"
      @click="handleClick"
    />
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'

import VPageMenuButton from '~/components/VHeader/VPageMenuButton'
import VContentSwitcherButton from '~/components/VHeader/VContentSwitcherButton'

const VMobileContentSwitcher = defineComponent({
  name: 'VMobileContentSwitcher',
  components: {
    VContentSwitcherButton,
    VPageMenuButton,
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
    isOverlayOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const {
      setActiveContentType,
      activeContentType,
      contentTypes,
    } = useContentType()

    const handleClick = () => {
      console.log('clicked')
      emit('open')
    }

    return {
      activeContentType,
      setActiveContentType,
      contentTypes,
      currentPage: props.route,
      handleClick,
    }
  },
})
export default VMobileContentSwitcher
</script>
