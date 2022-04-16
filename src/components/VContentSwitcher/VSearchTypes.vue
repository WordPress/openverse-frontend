<template>
  <VItemGroup
    direction="vertical"
    :size="size"
    :bordered="bordered"
    type="radiogroup"
    class="z-10 md:w-[260px] max-w-full"
  >
    <div
      v-for="(category, index) in contentTypeGroups"
      :key="index"
      :class="{
        'mt-2': index > 0,
        'bg-dark-charcoal-06 border-t border-dark-charcoal-20':
          index > 0 && !bordered,
      }"
    >
      <h4
        :class="bordered ? 'ps-0' : 'ps-6'"
        class="text-sr pt-6 pe-6 pb-4 uppercase font-semibold"
      >
        {{ $t(`search-type.${category.heading}`) }}
      </h4>
      <VSearchTypeItem
        v-for="(item, idx) in category.items"
        :key="item"
        class="md:mb-1"
        :item="item"
        :item-id="idx"
        :icon="content.icons[item]"
        :use-links="useLinks"
        :selected="item === activeItem"
        @click="handleClick(item)"
      />
    </div>
  </VItemGroup>
</template>
<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

import {
  ADDITIONAL,
  BETA,
  contentStatus,
  searchTypes,
  SUPPORTED,
} from '~/constants/media'
import useSearchType from '~/composables/use-search-type'

import VItemGroup from '~/components/VItemGroup/VItemGroup.vue'
import VSearchTypeItem from '~/components/VContentSwitcher/VSearchTypeItem.vue'

export default defineComponent({
  name: 'VSearchTypes',
  components: { VItemGroup, VSearchTypeItem },
  props: {
    /**
     * 'Small' size for mobile screens,
     * 'medium' size for larger screens.
     */
    size: {
      type: String,
      default: 'small',
      validator: (val) => ['small', 'medium'].includes(val),
    },
    activeItem: {
      type: String,
      required: true,
      validator: (val) => searchTypes.includes(val),
    },
    useLinks: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const content = useSearchType()

    const contentTypeGroups = [
      {
        heading: 'heading',
        items: content.types.filter((type) =>
          [SUPPORTED, BETA].includes(contentStatus[type])
        ),
      },
    ]

    /**
     * To edit the list of additional types, use the
     * `contentStatus` object in `constants/media`
     */
    contentTypeGroups.push({
      heading: 'additional',
      items: content.types.filter((type) => contentStatus[type] === ADDITIONAL),
    })

    const bordered = computed(() => props.size === 'small')
    const handleClick = (item) => {
      emit('select', item)
    }
    return {
      content,
      contentTypeGroups,
      bordered,
      handleClick,
    }
  },
})
</script>
