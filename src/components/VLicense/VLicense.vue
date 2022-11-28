<template>
  <div class="flex gap-1" :aria-label="licenseReadableName">
    <VIcon
      v-for="(name, index) in iconNames"
      :key="index"
      :class="{ 'bg-filled text-black' : bgFilled }"
      view-box="0 0 30 30"
      :icon-path="icons[name]"
      :size="4"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { License, LICENSE_ICONS } from '~/constants/license'
import { getElements } from "~/utils/license"
import { useI18n } from "~/composables/use-i18n"

import VIcon from '~/components/VIcon/VIcon.vue'


/**
 * Displays the icons for the license, with a readable license name in the aria-label.
 */
export default defineComponent({
  name: 'VLicense',
  components: { VIcon },
  props: {
    /**
     * the slug of the license
     * @values
     */
    license: {
      type: String as PropType<License>,
      required: true,
    },
    /**
     * Whether to display icons filled with a white background or leave them transparent.
     */
    bgFilled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const i18n = useI18n()

    const iconNames = computed(() => getElements(props.license))

    const licenseReadableName = computed(() =>
       i18n.t(`license-readable-names.${props.license}`).toString())

    return {
      icons: LICENSE_ICONS,
      iconNames,
      licenseReadableName,
    }
  },
})
</script>

<style scoped>
.bg-filled {
  background-image: radial-gradient(circle, #ffffff 60%, transparent 60%);
}
</style>
