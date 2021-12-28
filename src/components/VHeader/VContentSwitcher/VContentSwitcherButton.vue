<template>
  <VButton
    class="flex flex-row font-semibold"
    :variant="buttonVariant"
    :aria-label="buttonLabel"
    v-bind="a11yProps"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icon" />
    <span v-show="showLabel" :class="{ 'ms-2': showLabel }">{{
      buttonLabel
    }}</span>
    <VIcon
      v-show="isMinScreenMd"
      :class="{ 'ms-2': isMinScreenMd }"
      :icon-path="caretDownIcon"
    />
  </VButton>
</template>
<script>
import { computed, inject, useContext } from '@nuxtjs/composition-api'
import caretDownIcon from '~/assets/icons/caret-down.svg'

import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

export default {
  name: 'VContentSwitcherButton',
  components: { VButton, VIcon },
  props: {
    activeItem: {
      type: String,
      required: true,
    },
    icon: {
      type: process.env.NODE_ENV === 'test' ? Object : String,
      required: true,
    },
    a11yProps: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { i18n } = useContext()
    const isHeaderScrolled = inject('isHeaderScrolled')
    const isMinScreenMd = inject('isMinScreenMd')

    const buttonVariant = computed(() => {
      return isMinScreenMd.value && !isHeaderScrolled.value
        ? 'tertiary'
        : 'action-menu'
    })
    const buttonLabel = computed(() => {
      const labelKey = {
        image: 'search-type.image',
        audio: 'search-type.audio',
        all: 'search-type.all',
        video: 'search-type.video',
      }[props.activeItem]
      return i18n.t(labelKey)
    })
    const showLabel = computed(
      () => isMinScreenMd.value || !isHeaderScrolled.value
    )

    return {
      buttonVariant,
      buttonLabel,
      caretDownIcon,
      showLabel,
      isMinScreenMd,
    }
  },
}
</script>
