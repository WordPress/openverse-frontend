<template>
  <button
    class="bg-white border border-dark-charcoal/20 rounded-sm flex flex-col text-left py-4 ps-4 pe-16 hover:bg-dark-charcoal hover:text-white focus:bg-white focus:ring focus:ring-pink focus:outline-none focus:shadow-ring focus:text-black overflow-hidden"
  >
    <VIcon :icon-path="iconPath" />
    <p class="capitalize font-semibold pt-1">{{ mediaType }}</p>
    <span>{{ resultsCountLabel }}</span>
  </button>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { AUDIO, IMAGE, mediaTypes } from '~/constants/media'
import VIcon from '~/components/VIcon/VIcon.vue'

import audioIcon from '~/assets/icons/audio-wave.svg'
import imageIcon from '~/assets/icons/image.svg'

const iconMapping = {
  [AUDIO]: audioIcon,
  [IMAGE]: imageIcon,
}

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

    const iconPath = computed(() => iconMapping[props.mediaType])

    return { iconPath, imageIcon, resultsCountLabel }
  },
})
</script>
