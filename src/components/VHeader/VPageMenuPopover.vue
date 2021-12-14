<template>
  <VItemGroup direction="vertical" :bordered="false" type="radiogroup">
    <VItem
      v-for="(page, idx) in pages"
      :key="`${idx}-${page.name}`"
      :selected="page.id === currentPage"
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
const externalLinkProps = { target: '_blank', rel: 'noopener' }

export default {
  name: 'VPageMenuPopover',
  components: { VIcon, VItem, VItemGroup },
  props: {
    currentPage: {},
    icons: {},
    pages: {},
  },
  setup() {
    const getLinkProps = (item) => {
      return item.link.startsWith('/')
        ? { to: item.link }
        : { ...externalLinkProps, href: item.link }
    }
    return {
      getLinkProps,
    }
  },
}
</script>
