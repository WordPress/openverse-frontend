<template>
  <VItemGroup direction="vertical" :bordered="false" type="radiogroup">
    <VItem
      v-for="(page, idx) in pages"
      :key="`${idx}-${page.name}`"
      :selected="page.id === currentPageId"
      :is-first="idx === 0"
      size="medium"
      v-bind="getLinkProps(page)"
    >
      <span class="pe-2">{{ $t(page.name) }}</span>
      <VIcon v-if="page.icon" :icon-path="icons[page.icon]" class="me-2" />
    </VItem>
  </VItemGroup>
</template>
<script>
import VIcon from '~/components/VIcon/VIcon.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import allContent from '~/assets/icons/all-content.svg'
import audioContent from '~/assets/icons/audio-content.svg'
import imageContent from '~/assets/icons/image-content.svg'
import check from '~/assets/icons/checkmark.svg'
import externalLink from '~/assets/icons/external-link.svg'
import usePages from '~/composables/use-pages'
const externalLinkProps = { target: '_blank', rel: 'noopener' }

export default {
  name: 'VPageMenuPopover',
  components: { VIcon, VItem, VItemGroup },
  setup() {
    const icons = {
      allContent,
      audioContent,
      imageContent,
      check,
      externalLink,
    }
    const { pages, currentPageId } = usePages()
    const getLinkProps = (item) => {
      return item.link.startsWith('/')
        ? { to: item.link }
        : { ...externalLinkProps, href: item.link }
    }
    return {
      getLinkProps,
      icons,
      pages,
      currentPageId,
    }
  },
}
</script>
