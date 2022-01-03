<template>
  <VButton
    class="flex flex-row font-semibold"
    :variant="buttonVariant"
    :aria-label="$t(`search-type.${activeItem}`)"
    v-bind="a11yProps"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icon" />
    <span v-show="showLabel" :class="{ 'ms-2': showLabel }">{{
      $t(`search-type.${activeItem}`)
    }}</span>
    <VIcon
      v-show="isMdScreen"
      :class="{ 'ms-2': isMdScreen }"
      :icon-path="caretDownIcon"
    />
  </VButton>
</template>
<script>
import { computed, inject } from '@nuxtjs/composition-api'
import caretDownIcon from 'assets/icons/caret-down.svg'
import VIcon from '~/components/VIcon/VIcon.vue'

export default {
  name: 'VContentSwitcherButton',
  components: { VIcon },
  props: {
    activeItem: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    a11yProps: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isMdScreen = inject('isMdScreen')
    const isHeaderScrolled = inject('isHeaderScrolled')

    const buttonVariant = computed(() => {
      return isMdScreen.value && !isHeaderScrolled.value
        ? 'tertiary'
        : 'action-menu'
    })
    const showLabel = computed(
      () => isMdScreen.value || !isHeaderScrolled.value
    )

    return {
      buttonVariant,
      caretDownIcon,
      showLabel,
      isMdScreen,
    }
  },
}
</script>
