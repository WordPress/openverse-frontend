<template>
  <VItemGroup
    direction="vertical"
    :bordered="false"
    type="radiogroup"
    class="z-10"
  >
    <VItem
      v-for="(item, idx) in contentTypes"
      :key="idx"
      :selected="item.id === activeContentType.id"
      :is-first="idx === 0"
      size="medium"
      @click="setActiveContentType(item.id)"
    >
      <VIcon :icon-path="icons[item.icon]" class="me-2" />
      <span>{{ $t(`search-type.${item.id}`) }}</span>
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
import useContentType from '~/composables/use-content-type'

export default {
  name: 'VContentTypePopover',
  components: { VIcon, VItem, VItemGroup },
  setup() {
    const icons = {
      allContent,
      audioContent,
      imageContent,
      check,
      externalLink,
    }

    const {
      setActiveContentType,
      activeContentType,
      contentTypes,
    } = useContentType()

    return {
      activeContentType,
      contentTypes,
      icons,
      setActiveContentType,
    }
  },
}
</script>
