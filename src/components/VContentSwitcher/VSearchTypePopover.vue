<template>
  <VPopover
    ref="contentMenuPopover"
    class="flex items-stretch"
    :label="$t('search-type.label').toString()"
    placement="bottom-end"
    :clippable="true"
  >
    <template #trigger="{ a11yProps }">
      <VSearchTypeButton
        :a11y-props="a11yProps"
        aria-controls="content-switcher-popover"
        :active-item="activeItem"
      />
    </template>
    <VSearchTypes
      id="content-switcher-popover"
      size="medium"
      :active-item="activeItem"
      :use-links="true"
      @select="selectItem"
    />
  </VPopover>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

import type { SearchType } from '~/constants/media'
import { defineEvent } from '~/types/emits'

import useSearchType from '~/composables/use-search-type'

import VPopover from '~/components/VPopover/VPopover.vue'
import VSearchTypeButton from '~/components/VContentSwitcher/VSearchTypeButton.vue'
import VSearchTypes from '~/components/VContentSwitcher/VSearchTypes.vue'

import checkIcon from '~/assets/icons/checkmark.svg'

export default defineComponent({
  name: 'VSearchTypePopover',
  components: {
    VSearchTypeButton,
    VPopover,
    VSearchTypes,
  },
  model: {
    prop: 'activeItem',
    event: 'select',
  },
  emits: {
    select: defineEvent<SearchType>(),
  },
  setup(props, { emit }) {
    const contentMenuPopover = ref<HTMLElement | null>(null)
    const { activeType: activeItem } = useSearchType()

    /**
     * Only the contentMenuPopover needs to be closed programmatically
     */
    const closeMenu = () => {
      contentMenuPopover.value?.close()
    }

    const selectItem = (item: SearchType) => {
      emit('select', item)
      closeMenu()
    }

    return {
      checkIcon,
      selectItem,
      activeItem,
      contentMenuPopover,
      closeMenu,
    }
  },
})
</script>
