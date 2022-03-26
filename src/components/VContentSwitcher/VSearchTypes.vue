<template>
  <VItemGroup
    direction="vertical"
    :size="size"
    :bordered="bordered"
    :heading="$t('search-type.heading')"
    type="radiogroup"
    class="z-10 w-[260px] max-w-full"
  >
    <VSearchTypeItem
      v-for="(item, idx) in content.types"
      :key="item"
      class="md:mb-1"
      :item="item"
      :item-id="idx"
      :icon="content.icons[item]"
      :use-links="useLinks"
      :selected="item === activeItem"
      @click="handleClick(item)"
    />
    <div
      v-if="content.additionalTypes && content.additionalTypes.length > 0"
      class="bg-dark-charcoal-06 border-t border-dark-charcoal-20 mt-2"
    >
      <h4 class="text-sr p-6 pb-4 uppercase font-semibold">
        {{ $t('search-type.additional') }}
      </h4>
      <VSearchTypeItem
        v-for="(item, idx) in content.additionalTypes"
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

import { isDev } from '~/utils/node-env'

import { supportedSearchTypes } from '~/constants/media'
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
      validator: (val) => supportedSearchTypes.includes(val),
    },
    useLinks: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const content = useSearchType()
    /**
     * @todo This is for testing purposes only! We may want a different abstraction here;
     * For example having all content types under `content.types` and making them filterable,
     * like `const additional = [...content.types.filter(i => i.status === ADDITIONAL)]`.
     */
    if (isDev) {
      content.additionalTypes = ['3d-model']
    }

    const bordered = computed(() => props.size === 'small')
    const handleClick = (item) => {
      emit('select', item)
    }
    return {
      content,
      bordered,
      handleClick,
    }
  },
})
</script>
