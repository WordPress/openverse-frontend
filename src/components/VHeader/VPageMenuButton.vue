<template>
  <VButton
    variant="action-menu-secondary"
    :pressed="pressed"
    :icon-props="{ iconPath: ellipsisIcon }"
    :aria-label="$t('header.aria.menu')"
    @click="handleClick"
  >
    <VIcon :icon-path="ellipsisIcon" />
  </VButton>
</template>
<script>
import ellipsisIcon from '~/assets/icons/ellipsis.svg'
import VIcon from '~/components/VIcon/VIcon.vue'

export default {
  name: 'VPageMenuButton',
  components: { VIcon },
  props: {
    pressed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => emit('click')
    return {
      ellipsisIcon,
      handleClick,
    }
  },
}
</script>
