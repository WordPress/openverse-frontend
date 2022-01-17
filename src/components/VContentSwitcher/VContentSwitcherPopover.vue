<template>
  <VPopover
    ref="contentMenuPopover"
    class="flex mx-4 items-stretch"
    :label="$t('search-type.label')"
  >
    <template #trigger="{ a11yProps }">
      <VContentSwitcherButton :a11y-props="a11yProps" />
    </template>
    <VItemGroup
      direction="vertical"
      :bordered="false"
      type="radiogroup"
      class="z-10"
    >
      <VItem
        v-for="(item, idx) in content.types"
        :key="idx"
        :selected="item === content.activeType.value"
        :is-first="idx === 0"
        @click.native="handleClick(item)"
      >
        <VIcon :icon-path="content.icons[item]" class="me-2 ms-4 my-4" />
        <span class="pe-20 py-4 font-semibold">{{
          $t(`search-type.${item}`)
        }}</span>
      </VItem>
    </VItemGroup>
  </VPopover>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'
import checkIcon from '~/assets/icons/checkmark.svg'

import VPopover from '~/components/VPopover/VPopover.vue'
import VContentSwitcherButton from '~/components/VContentSwitcher/VContentSwitcherButton.vue'

export default {
  name: 'VContentSwitcherPopover',
  components: {
    VContentSwitcherButton,
    VPopover,
  },
  setup(_, { emit }) {
    const content = useContentType()

    const contentMenuPopover = ref(null)
    /**
     * Only the contentMenuPopover needs to be closed programmatically
     */
    const closeMenu = () => {
      if (contentMenuPopover.value) {
        contentMenuPopover.value.close()
      }
    }

    const handleClick = (item) => {
      emit('select', item)
    }

    return {
      content,
      checkIcon,
      handleClick,
      contentMenuPopover,
      closeMenu,
    }
  },
}
</script>
