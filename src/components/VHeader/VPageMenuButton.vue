<template>
  <VButton
    variant="action-menu-secondary"
    :icon-props="{ iconPath: ellipsisIcon }"
    :aria-label="$t('header.aria.menu')"
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
  setup() {
    return {
      ellipsisIcon,
    }
  },
}
</script>
