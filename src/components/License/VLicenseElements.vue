<template>
  <ul>
    <li
      v-for="element in elementNames"
      :key="element"
      class="flex items-center gap-3 mb-2 text-sm md:text-base"
    >
      <VIcon
        view-box="0 0 30 30"
        :size="isSmall ? 5 : 6"
        :icon-path="icons[element]"
      />
      <span v-if="elementNames.length > 1" class="sr-only">{{
        element.toUpperCase()
      }}</span>
      <p :class="{ 'text-sm': isSmall }">
        {{ $t(`browse-page.license-description.${element}`) }}
      </p>
    </li>
  </ul>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { getElements } from '~/utils/license'

import { ALL_LICENSES } from '~/constants/license'

import VIcon from '~/components/VIcon/VIcon.vue'

import by from '~/assets/licenses/by.svg'
import zero from '~/assets/licenses/zero.svg'
import nc from '~/assets/licenses/nc.svg'
import nd from '~/assets/licenses/nd.svg'
import pd from '~/assets/licenses/pd.svg'
import sa from '~/assets/licenses/sa.svg'
import samplingPlus from '~/assets/licenses/sampling.plus.svg'

export default defineComponent({
  name: 'VLicenseElements',
  components: { VIcon },
  props: {
    /**
     * the slug of the license
     * @values ALL_LICENSES
     */
    license: {
      type: String,
      required: true,
      validator: (val) => ALL_LICENSES.includes(val),
    },
    /**
     * the size of the icons and text
     */
    size: {
      type: String,
      default: 'big',
      validator: (val) => ['big', 'small'].includes(val),
    },
  },
  setup(props) {
    const elementNames = computed(() =>
      getElements(props.license).filter((icon) => icon !== 'cc')
    )

    const isSmall = computed(() => props.size === 'small')

    return {
      icons: {
        by,
        nc,
        nd,
        pd,
        sa,
        zero,
        'sampling-plus': samplingPlus,
      },

      elementNames,
      isSmall,
    }
  },
})
</script>
