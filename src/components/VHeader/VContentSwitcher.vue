<template>
  <div class="flex flex-row items-center flex-grow justify-between">
    <VDesktopContentSwitcher
      v-if="isMdScreen"
      :pages="state.pages"
      :icons="icons"
      :is-header-scrolled="isHeaderScrolled"
      :is-search="isSearch"
      :route="route"
    />
    <VMobileContentSwitcher
      v-else
      :pages="state.pages"
      :icons="icons"
      :is-search="isSearch"
      :route="route"
      :is-overlay-open="isOverlayOpen"
      @open="openOverlay"
    />
  </div>
</template>
<script>
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'

import audioContent from '~/assets/icons/audio-content.svg'
import imageContent from '~/assets/icons/image-content.svg'
import allContent from '~/assets/icons/all-content.svg'
import check from '~/assets/icons/checkmark.svg'
import externalLink from '~/assets/icons/external-link.svg'
import VDesktopContentSwitcher from '~/components/VHeader/VDesktopContentSwitcher'
import VMobileContentSwitcher from '~/components/VHeader/VMobileContentSwitcher'

const VContentSwitcher = defineComponent({
  name: 'VContentSwitcher',
  components: {
    VDesktopContentSwitcher,
    VMobileContentSwitcher,
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
    isOverlayOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { app } = useContext()

    const icons = {
      allContent,
      audioContent,
      imageContent,
      check,
      externalLink,
    }
    const state = reactive({
      pages: [
        {
          id: 'about',
          name: 'header.about-nav-item',
          link: app.localePath('/about'),
        },
        {
          id: 'sources',
          name: 'header.source-nav-item',
          link: app.localePath('/sources'),
        },
        {
          id: 'licenses',
          name: 'header.licenses-nav-item',
          icon: 'externalLink',
          link: 'https://creativecommons.org/about/cclicenses/',
        },
        {
          id: 'search-help',
          name: 'header.search-guide-nav-item',
          link: app.localePath('/search-help'),
        },
        {
          id: 'meta-search',
          name: 'header.meta-search-nav-item',
          link: app.localePath('/meta-search'),
        },
        {
          id: 'feedback',
          name: 'header.feedback-nav-item',
          link: app.localePath('/feedback'),
        },
        {
          id: 'api',
          name: 'header.api-nav-item',
          icon: 'externalLink',
          link: 'https://api.openverse.engineering/v1/',
        },
        {
          id: 'extension',
          name: 'header.extension-nav-item',
          link: app.localePath('/extension'),
        },
      ],
    })

    const {
      setActiveContentType,
      activeContentType,
      contentTypes,
    } = useContentType()

    const openOverlay = () => {
      emit('open-overlay')
    }
    return {
      activeContentType,
      state,
      setActiveContentType,
      contentTypes,
      icons,
      currentPage: props.route,
      openOverlay,
    }
  },
})
export default VContentSwitcher
</script>
