<template>
  <VPopover
    ref="popoverEl"
    :hide-on-click-outside="false"
    placement="bottom-end"
  >
    <template #trigger="{ a11yProps }">
      <VContentReportButton v-bind="a11yProps" />
    </template>
    <div class="relative">
      <VContentReportForm :media="media" :provider-name="providerName" />
      <VIconButton
        class="absolute top-0 end-0 border-none"
        size="search-medium"
        :icon-props="{ iconPath: icons.closeSmall }"
        @click="handleClose"
      />
    </div>
  </VPopover>
</template>

<script>
import {
  ref,
  computed,
  useStore,
  defineComponent,
} from '@nuxtjs/composition-api'

import VPopover from '~/components/VPopover/VPopover.vue'
import VContentReportButton from '~/components/VContentReport/VContentReportButton.vue'

import flagIcon from '~/assets/icons/flag.svg'
import closeSmallIcon from '~/assets/icons/close-small.svg'

export default defineComponent({
  name: 'VContentReportPopover',
  components: { VPopover, VContentReportButton },
  props: {
    /**
     * the media item to report; This can either be an audio track or an image.
     */
    media: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore()

    const popoverEl = ref(null)
    const handleClose = () => {
      // TODO: Hack till https://github.com/WordPress/openverse-frontend/issues/725
      popoverEl.value.close()
    }

    const getProviderName = (nameCode) =>
      store.getters['provider/getProviderName'](nameCode)
    const providerName = computed(() => getProviderName(props.media.provider))

    return {
      icons: { flag: flagIcon, closeSmall: closeSmallIcon },

      popoverEl,
      handleClose,

      providerName,
    }
  },
})
</script>
