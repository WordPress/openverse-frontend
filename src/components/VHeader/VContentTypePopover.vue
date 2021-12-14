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
      :selected="item.id === activeItem.id"
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

export default {
  name: 'VContentTypePopover',
  components: { VIcon, VItem, VItemGroup },
  props: {
    activeItem: {},
    contentTypes: {},
    icons: {},
  },
  setup(_, { emit }) {
    const setActiveContentType = (itemId) => {
      emit('set-active', itemId)
    }
    return {
      setActiveContentType,
    }
  },
}
</script>
