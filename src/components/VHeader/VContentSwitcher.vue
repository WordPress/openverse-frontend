<template>
  <div class="flex flex-row items-center flex-grow justify-between">
    <VPopover class="mx-4">
      <template #trigger>
        <VPageMenuButton :icons="icons" />
      </template>
      <template #default>
        <VPageMenuPopover
          :current-page="currentPage"
          :icons="icons"
          :pages="state.pages"
        />
      </template>
    </VPopover>
    <VPopover v-if="isSearch" class="mx-4">
      <template #trigger>
        <VContentSwitcherButton
          :active-item="activeContentType"
          :icons="icons"
          :is-header-scrolled="isHeaderScrolled"
        />
      </template>
      <template #default>
        <VContentTypePopover
          :active-item="activeContentType"
          :content-types="contentTypes"
          :icons="icons"
          @set-active="setActiveContentType"
        />
      </template>
    </VPopover>
  </div>
</template>
<script>
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'

import VPopover from '~/components/VPopover/VPopover.vue'

import audioContent from '~/assets/icons/audio-content.svg'
import imageContent from '~/assets/icons/image-content.svg'
import allContent from '~/assets/icons/all-content.svg'
import check from '~/assets/icons/checkmark.svg'
import externalLink from '~/assets/icons/external-link.svg'
import VPageMenuButton from '~/components/VHeader/VPageMenuButton'
import VContentSwitcherButton from '~/components/VHeader/VContentSwitcherButton'
import VPageMenuPopover from '~/components/VHeader/VPageMenuPopover'
import VContentTypePopover from '~/components/VHeader/VContentTypePopover'

const VContentSwitcher = defineComponent({
  name: 'VContentSwitcher',
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
  },
  setup(props) {
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

    return {
      activeContentType,
      state,
      setActiveContentType,
      contentTypes,
      icons,
      currentPage: props.route,
    }
  },
})
export default VContentSwitcher
</script>
