<template>
  <VItemGroup
    direction="vertical"
    :bordered="bordered"
    type="radiogroup"
    class="z-10"
  >
    <VItem
      v-for="(item, idx) in content.types"
      :key="idx"
      :selected="item === activeItem"
      :is-first="idx === 0"
      @click.native="handleClick(item)"
    >
      <VIcon :icon-path="content.icons[item]" class="me-2 ms-0 my-4" />
      <span class="pe-6 md:pe-20 py-4 font-semibold">{{
        $t(`search-type.${item}`)
      }}</span>
      <VPill
        v-if="contentStatus[item] === statuses.BETA"
        class="self-center ms-0 md:ms-auto"
        >{{ $t('search-type.status-beta') }}</VPill
      >
    </VItem>
  </VItemGroup>
</template>
<script>
import {
  contentStatus,
  statuses,
  supportedContentTypes,
} from '~/constants/media'
import useContentType from '~/composables/use-content-type'

import checkIcon from '~/assets/icons/checkmark.svg'

import VIcon from '~/components/VIcon/VIcon.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VPill from '~/components/VPill.vue'

export default {
  name: 'VContentTypes',
  components: { VIcon, VItem, VItemGroup, VPill },
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
      checkIcon,
      handleClick,
      contentStatus,
      statuses,
    }
  },
}
</script>
