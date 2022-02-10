<template>
  <VButton
    class="flex flex-row font-semibold py-2 text-sr md:text-base"
    :class="sizeClasses"
    :variant="buttonVariant"
    size="disabled"
    :aria-label="buttonLabel"
    v-bind="a11yProps"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icon" />
    <p
      v-show="showLabel"
      :class="{ 'ms-2 text-left': showLabel }"
      :style="labelFixedWidthStyle"
    >
      {{ buttonLabel }}
    </p>
    <span
      v-if="showLabel"
      ref="testLabel"
      class="absolute invisible h-auto w-auto whitespace-nowrap"
      >{{ longestLabel }}</span
    >
    <VIcon
      class="hidden md:block text-dark-charcoal-40 md:ms-2"
      :icon-path="caretDownIcon"
    />
  </VButton>
</template>
<script>
import { ALL_MEDIA, supportedContentTypes } from '~/constants/media'
import {
  computed,
  inject,
  onMounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import useContentType from '~/composables/use-content-type'
import { isMinScreen } from '~/composables/use-media-query'

import caretDownIcon from '~/assets/icons/caret-down.svg'

import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

export default {
  name: 'VContentSwitcherButton',
  components: { VButton, VIcon },
  props: {
    a11yProps: {
      type: Object,
      required: true,
    },
    activeItem: {
      type: String,
      default: ALL_MEDIA,
      validator: (val) => supportedContentTypes.includes(val),
    },
  },
  setup(props) {
    const testLabel = ref(null)
    const { i18n } = useContext()
    const isHeaderScrolled = inject('isHeaderScrolled', null)
    const isMinScreenMd = isMinScreen('md', { shouldPassInSSR: true })

    const { icons, activeType: activeItem } = useContentType()
    const isIconButton = computed(
      () => isHeaderScrolled?.value && !isMinScreenMd.value
    )
    const sizeClasses = computed(() =>
      isIconButton.value ? 'w-10 h-10' : 'ps-2 pe-3'
    )
    const buttonVariant = computed(() => {
      return isMinScreenMd.value && !isHeaderScrolled?.value
        ? 'tertiary'
        : 'action-menu'
    })
    /**
     * Get the longest translated label, assuming that the word that has the most characters is the longest.
     */
    const longestLabel = computed(() => {
      const translatedLabels = supportedContentTypes
        .map((type) => `search-type.${type}`)
        .map((key) => i18n.t(key))
      const maxLength = Math.max(
        ...translatedLabels.map((label) => label.length || 0)
      )
      return translatedLabels.find((label) => label.length === maxLength)
    })

    const labelFixedWidthStyle = ref(' width:80px;')
    onMounted(() => {
      const widthInPx = testLabel.value.clientWidth
      labelFixedWidthStyle.value = `width:${widthInPx}px;`
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
      () => isMinScreenMd.value || !isHeaderScrolled?.value
    )

    return {
      buttonVariant,
      sizeClasses,
      buttonLabel,
      longestLabel,
      labelFixedWidthStyle,
      testLabel,
      caretDownIcon,
      showLabel,
      isHeaderScrolled,
      isMinScreenMd,
      icon: computed(() => icons[activeItem.value]),
    }
  },
}
</script>
