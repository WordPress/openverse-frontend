<template>
  <VButton
    class="flex w-12 flex-row py-2 font-semibold xl:w-auto"
    :class="sizeClasses"
    variant="action-menu"
    size="disabled"
    :aria-label="buttonLabel"
    v-bind="a11yProps"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icon" />
    <span class="hidden truncate xl:block xl:ms-2 xl:text-start">{{
      buttonLabel
    }}</span>
    <VIcon
      class="hidden text-dark-charcoal-40 xl:block xl:ms-2"
      :icon-path="caretDownIcon"
    />
  </VButton>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  PropType,
} from '@nuxtjs/composition-api'

import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  type SearchType,
  VIDEO,
} from '~/constants/media'
import { IsMinScreenLgKey } from '~/types/provides'
import useSearchType from '~/composables/use-search-type'
import { useI18n } from '~/composables/use-i18n'

import VIcon from '~/components/VIcon/VIcon.vue'
import VButton from '~/components/VButton.vue'

import caretDownIcon from '~/assets/icons/caret-down.svg'

/**
 * The i18n keys; static so that the vue-i18n can detect them as used.
 */
const labels = {
  [ALL_MEDIA]: 'search-type.all',
  [IMAGE]: 'search-type.image',
  [VIDEO]: 'search-type.video',
  [AUDIO]: 'search-type.audio',
}
/**
 * This is the content type switcher button that is used in the header.
 */
export default defineComponent({
  name: 'VSearchTypeButton',
  components: { VButton, VIcon },
  props: {
    a11yProps: {
      type: Object,
      required: true,
    },
    activeItem: {
      type: String as PropType<SearchType>,
      default: ALL_MEDIA,
    },
  },
  setup(props) {
    const i18n = useI18n()
    const isMinScreenLg = inject(IsMinScreenLgKey)

    const { icons, activeType: activeItem } = useSearchType()
    const isIconButton = computed(() => !isMinScreenLg.value)
    /**
     When there is a caret down icon (on 'lg' screens), paddings are balanced,
     without it, paddings need to be adjusted.
     */
    const sizeClasses = computed(() =>
      isIconButton.value ? 'w-10 h-10' : 'ps-2 pe-3 md:px-2'
    )

    const buttonLabel = computed(() => i18n.t(labels[props.activeItem]))

    return {
      sizeClasses,
      buttonLabel,
      caretDownIcon,
      icon: computed(() => icons[activeItem.value]),
    }
  },
})
</script>
