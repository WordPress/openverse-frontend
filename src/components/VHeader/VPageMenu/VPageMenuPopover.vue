<template>
  <VItemGroup
    :direction="isMinScreenMd ? 'vertical' : 'columns'"
    :class="{ 'mt-10': !isMinScreenMd }"
    :bordered="false"
  >
    <VItem
      v-for="(page, idx) in pages.all"
      :key="page.id"
      :class="{ 'w-1/2': !isMinScreenMd }"
      :selected="page.id === pages.current"
      :is-first="idx === 0"
      v-bind="getLinkProps(page)"
    >
      <div class="flex flex-row">
        <span class="pe-2">{{ $t(page.name) }}</span>
        <VIcon
          v-if="isLinkExternal(page)"
          :icon-path="externalLinkIcon"
          :size="5"
          class="self-center mb-0.5"
        />
      </div>
    </VItem>
  </VItemGroup>
</template>
<script>
import usePages from '~/composables/use-pages'
import { isMinScreen } from '~/composables/use-media-query'

import externalLinkIcon from '~/assets/icons/external-link.svg'

import VIcon from '~/components/VIcon/VIcon.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'

const externalLinkProps = { as: 'a', target: '_blank', rel: 'noopener' }

export default {
  name: 'VPageMenuPopover',
  components: { VIcon, VItem, VItemGroup },
  setup() {
    const pages = usePages()
    const isMinScreenMd = isMinScreen('md')
    const isLinkExternal = (item) => !item.link.startsWith('/')
    const getLinkProps = (item) => {
      return isLinkExternal(item)
        ? { ...externalLinkProps, href: item.link }
        : { as: 'NuxtLink', to: item.link }
    }
    return {
      getLinkProps,
      isLinkExternal,
      externalLinkIcon,
      pages,
      isMinScreenMd,
    }
  },
}
</script>
