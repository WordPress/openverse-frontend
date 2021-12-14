<template>
  <VButton
    class="flex flex-row"
    :variant="isHeaderScrolled ? 'action-menu-secondary' : 'action-menu'"
    :pressed="pressed"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icons[activeItem.icon]" class="me-2" />
    {{ $t(`search-type.${activeItem.id}`) }}
    <VIcon class="ms-2" :icon-path="caretDownIcon" />
  </VButton>
</template>
<script>
import caretDownIcon from '~/assets/icons/caret-down.svg'
import VIcon from '~/components/VIcon/VIcon.vue'

export default {
  name: 'VContentSwitcherButton',
  components: { VIcon },
  props: {
    activeItem: {},
    icons: {},
    isHeaderScrolled: {},
    pressed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      caretDownIcon,
    }
  },
}
</script>
