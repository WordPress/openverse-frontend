<template>
  <div class="flex flex-row items-center">
    <VPopover class="mx-4">
      <template #trigger>
        <VIconButton
          :icon-props="{ iconPath: icons.ellipsis }"
          :aria-label="$t('header.aria.menu')"
      /></template>
      <template #default>
        <VItemGroup direction="vertical" :bordered="false" type="menu">
          <VItem
            v-for="(page, idx) in state.pages"
            :key="`${idx}-${page.name}`"
            :selected="page.active"
            :is-first="idx === 0"
            size="medium"
            :link="page.link"
            v-bind="getLinkProps(page)"
          >
            <span class="pe-2">{{ $t(page.name) }}</span>
            <VIcon
              v-if="page.icon"
              :icon-path="icons[page.icon]"
              class="me-2"
            />
          </VItem>
        </VItemGroup>
      </template>
    </VPopover>

    <VPopover class="mx-4">
      <template #trigger>
        <button class="flex flex-row">
          <VIcon :icon-path="icons[activeItem.icon]" class="me-2" />
          {{ $t(`search-type.${activeItem.id}`) }}
          <VIcon class="ms-2" :icon-path="icons.caretDown" />
        </button>
      </template>
      <template #default>
        <VItemGroup
          direction="vertical"
          :bordered="false"
          type="menu"
          class="z-10"
        >
          <VItem
            v-for="(item, idx) in contentTypes"
            :key="idx"
            :selected="item.id === activeItem.id"
            :is-first="idx === 0"
            size="medium"
            @click="setActiveContentType(item.id)"
          >
            <VIcon :icon-path="icons[item.icon]" class="me-2" />
            <span>{{ $t(`search-type.${item.id}`) }}</span>
            <VIcon
              v-if="item.id === activeItem.id"
              :icon-path="icons.check"
              class="ms-8"
            />
          </VItem>
        </VItemGroup>
      </template>
    </VPopover>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { useMediaQuery } from '~/composables/use-media-query'
import useContentType from '~/composables/use-content-type'

import VIcon from '~/components/VIcon/VIcon.vue'
import VIconButton from '~/components/VIconButton/VIconButton.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VPopover from '~/components/VPopover/VPopover.vue'

import audioContent from '~/assets/icons/audio-content.svg'
import imageContent from '~/assets/icons/image-content.svg'
import allContent from '~/assets/icons/all-content.svg'
import check from '~/assets/icons/checkmark.svg'
import caretDown from '~/assets/icons/caret-down.svg'
import ellipsis from '~/assets/icons/ellipsis.svg'
import externalLink from '~/assets/icons/external-link.svg'

const VContentSwitcher = defineComponent({
  name: 'VContentSwitcher',
  components: {
    VIcon,
    VIconButton,
    VItem,
    VItemGroup,
    VPopover,
  },
  setup() {
    const { app } = useContext()

    const defaultWindow = typeof window !== 'undefined' ? window : undefined
    const isTablet = useMediaQuery('(min-width: 640px)', defaultWindow)
    watch(
      () => isTablet,
      () => {
        console.log('isTablet changed: ', isTablet.value)
      }
    )
    const icons = {
      caretDown,
      allContent,
      audioContent,
      imageContent,
      check,
      ellipsis,
      externalLink,
    }
    const state = reactive({
      pages: [
        {
          id: 'about',
          name: 'header.about-nav-item',
          active: true,
          link: app.localePath('/about'),
        },
        {
          id: 'sources',
          name: 'header.source-nav-item',
          active: false,
          link: app.localePath('/sources'),
        },
        {
          id: 'licenses',
          name: 'header.licenses-nav-item',
          active: false,
          icon: 'externalLink',
          link: 'https://creativecommons.org/about/cclicenses/',
        },
        {
          id: 'search-help',
          name: 'header.search-guide-nav-item',
          active: false,
          link: app.localePath('/search-help'),
        },
        {
          id: 'meta',
          name: 'header.meta-search-nav-item',
          active: false,
          link: app.localePath('/meta-search'),
        },
        {
          id: 'feedback',
          name: 'header.feedback-nav-item',
          active: false,
          link: app.localePath('/feedback'),
        },
        {
          id: 'api',
          name: 'header.api-nav-item',
          active: false,
          icon: 'externalLink',
          link: 'https://api.openverse.engineering/v1/',
        },
        {
          id: 'extension',
          name: 'header.extension-nav-item',
          active: false,
          link: app.localePath('/extension'),
        },
      ],
    })

    const getLinkProps = (item) => {
      return item.link.startsWith('/')
        ? {
            to: app.localePath(item.link),
          }
        : {
            href: item.link,
            target: '_blank',
            rel: 'noopener',
          }
    }

    const onClick = (event) => {
      console.log(event)
      alert('clicked!')
    }

    const { setActiveContentType, activeItem, contentTypes } = useContentType()

    return {
      activeItem,
      isTablet,
      state,
      onClick,
      getLinkProps,
      setActiveContentType,
      contentTypes,
      icons,
    }
  },
})
export default VContentSwitcher
</script>
