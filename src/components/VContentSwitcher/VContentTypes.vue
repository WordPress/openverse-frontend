<template>
  <VItemGroup
    direction="vertical"
    :bordered="bordered"
    type="radiogroup"
    class="z-10"
  >
    <VContentItem
      v-for="(item, idx) in content.types"
      :key="item"
      :class="{ 'mb-1': !bordered }"
      :item="item"
      :item-id="idx"
      :icon="content.icons[item]"
      :selected="item === activeItem"
      @click="handleClick(item)"
    />
  </VItemGroup>
</template>
<script>
import { supportedContentTypes } from '~/constants/media'
import useContentType from '~/composables/use-content-type'

import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VContentItem from '~/components/VContentSwitcher/VContentItem.vue'

export default {
  name: 'VContentTypes',
  components: { VItemGroup, VContentItem },
  props: {
    bordered: {
      type: Boolean,
      default: true,
    },
    activeItem: {
      type: String,
      required: true,
      validator: (val) => supportedContentTypes.includes(val),
    },
  },
  setup(_, { emit }) {
    const content = useContentType()

    const handleClick = (item) => {
      emit('select', item)
    }
    return {
      content,
      handleClick,
    }
  },
}
</script>
