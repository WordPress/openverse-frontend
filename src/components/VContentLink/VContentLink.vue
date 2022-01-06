<template>
  <button
    class="bg-white border border-dark-charcoal/50 rounded-sm flex hover:bg-dark-charcoal hover:text-white focus:bg-white focus:ring focus:ring-pink focus:outline-none focus:shadow-ring focus:text-black overflow-hidden"
    :class="[
      isStacked
        ? 'flex-col items-start py-4 ps-4 pe-12'
        : 'flex-row justify-between items-center w-full min-w-[22rem] p-6',
    ]"
    role="radio"
    type="button"
    :aria-checked="isSelected"
    @click="$emit('selected', mediaType)"
  >
    <div
      class="flex"
      :class="[isStacked ? 'flex-col items-start' : ' flex-row items-center']"
    >
      <VIcon :icon-path="iconPath" />
      <p class="font-semibold" :class="[isStacked ? 'pt-1' : 'ps-2 text-2xl']">
        {{
          isStacked
            ? $t(`search-tab.${mediaType}`)
            : $t(`search-tab.see-${mediaType}`)
        }}
      </p>
    </div>
    <span :class="{ 'text-sr': !isStacked }">{{ resultsCountLabel }}</span>
  </button>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { AUDIO, IMAGE, mediaTypes } from '~/constants/media'
import VIcon from '~/components/VIcon/VIcon.vue'

import audioIcon from '~/assets/icons/audio-wave.svg'
import imageIcon from '~/assets/icons/image.svg'

export default defineComponent({
  name: 'VContentLink',
  components: { VIcon },
  props: {
    mediaType: {
      type: String,
      required: true,
      validator: (val) => mediaTypes.includes(val),
    },
    resultsCount: {
      type: Number,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'stacked',
      validator: (val) => ['stacked', 'horizontal'].includes(val),
    },
  },
  setup(props) {
    const { i18n } = useContext()

    /**
     * The translated string showing how many results were found for this media type.
     *
     * @returns {string}
     */
    const resultsCountLabel = computed(() => {
      const count = props.resultsCount
      const i18nKey = 'browse-page.all-result-count'
      const localeCount = count.toLocaleString(i18n.locale)
      return i18n.tc(i18nKey, count, { localeCount })
    })

    const iconMapping = {
      [AUDIO]: audioIcon,
      [IMAGE]: imageIcon,
    }
    const iconPath = computed(() => iconMapping[props.mediaType])

    const isStacked = computed(() => props.layout == 'stacked')

    return { iconPath, imageIcon, resultsCountLabel, isStacked }
  },
})
</script>

<style scoped>
button[aria-checked='true'] {
  @apply bg-dark-charcoal text-white;
}
</style>
