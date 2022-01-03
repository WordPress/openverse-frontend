<template>
  <VButton
    variant="action-menu"
    size="disabled"
    class="font-semibold py-2 px-3 leading-7"
    :aria-label="$t('header.aria.menu')"
    v-bind="a11yProps"
    @click="$emit('click')"
  >
    <VIcon :icon-path="ellipsisIcon" />
  </VButton>
</template>
<script>
import ellipsisIcon from 'assets/icons/ellipsis.svg'
import VIcon from '@/components/VIcon/VIcon.vue'

export default {
  name: 'VPageMenuButton',
  components: { VIcon },
  props: {
    a11yProps: {},
  },
  setup() {
    return {
      ellipsisIcon,
    }
  },
}
</script>
