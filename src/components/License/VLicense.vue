<template>
  <div class="license flex flex-row items-center gap-2">
    <div class="flex gap-1">
      <VIcon
        v-for="(name, index) in iconNames"
        :key="index"
        :class="['icon', bgFilled ? 'bg-filled text-black' : '']"
        view-box="0 0 30 30"
        :icon-path="icons[name]"
        :size="4"
      />
    </div>
    <span v-show="!hideName" class="name" :aria-label="licenseName.readable">
      {{ licenseName.full }}
    </span>
  </div>
</template>

<script>
import { computed, useContext } from '@nuxtjs/composition-api'

import { ALL_LICENSES } from '~/constants/license'

import { getFullLicenseName, getElements } from '~/utils/license'

import VIcon from '~/components/VIcon/VIcon.vue'

import by from '~/assets/licenses/by.svg'
import zero from '~/assets/licenses/zero.svg'
import cc from '~/assets/licenses/cc.svg'
import nc from '~/assets/licenses/nc.svg'
import nd from '~/assets/licenses/nd.svg'
import pd from '~/assets/licenses/pd.svg'
import sa from '~/assets/licenses/sa.svg'
import samplingPlus from '~/assets/licenses/sampling.plus.svg'

/**
 * Displays the icons for the license along with a readable display name for the
 * license.
 */
export default {
  name: 'VLicense',
  components: { VIcon },
  props: {
    /**
     * the slug of the license
     * @values
     */
    license: {
      type: String,
      required: true,
      validator: (val) => ALL_LICENSES.includes(val),
    },
    /**
     * Whether to display icons filled with a white background or leave them transparent.
     */
    bgFilled: {
      type: Boolean,
      default: false,
    },
    /**
     * Either to show the license name next to the icons or hide it.
     */
    hideName: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { i18n } = useContext()

    const iconNames = computed(() => getElements(props.license))
    const licenseName = computed(() => {
      return {
        readable: i18n.t(`license-readable-names.${props.license}`),
        full: getFullLicenseName(props.license, '', i18n),
      }
    })

    return {
      icons: {
        cc,
        by,
        nc,
        nd,
        pd,
        sa,
        zero,
        'sampling-plus': samplingPlus,
      },

      iconNames,
      licenseName,
    }
  },
}
</script>

<style scoped>
.bg-filled {
  background-image: radial-gradient(circle, #ffffff 60%, transparent 60%);
}
</style>
