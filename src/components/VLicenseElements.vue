<template>
  <ul>
    <li
      v-for="element in elements"
      :key="element"
      class="flex items-center gap-3 mb-2 text-sm md:text-base"
    >
      <VIcon
        view-box="0 0 30 30"
        :size="isSmall ? 5 : 6"
        :icon-path="icons[element]"
      />
      <span v-if="elements.length > 1" class="sr-only">{{
        element.toUpperCase()
      }}</span>
      <p :class="{ 'text-sm': isSmall }">
        {{ $t(`browse-page.license-description.${element}`) }}
      </p>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import type { License, LicenseElement } from '~/constants/license'
import { licenseIcons } from '~/constants/license'

import VIcon from '~/components/VIcon/VIcon.vue'

export default defineComponent({
  name: 'VLicenseElements',
  components: { VIcon },
  props: {
    license: {
      type: String as PropType<License>,
      required: true,
    },
    size: {
      type: String as PropType<'big' | 'small'>,
      default: 'big',
      validator: (val: string) => ['big', 'small'].includes(val),
    },
  },
  setup(props) {
    const elements = computed(() => {
      return props.license.split('-') as LicenseElement[]
    })

    const isSmall = computed(() => props.size === 'small')

    return {
      icons: licenseIcons,
      elements,
      isSmall,
    }
  },
})
</script>
