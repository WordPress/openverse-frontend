<template>
  <ul
    class="flex"
    :class="[
      mode === 'dark' ? 'text-dark-charcoal' : 'bg-dark-charcoal text-white',
      variant === 'inline'
        ? 'flex-row items-center gap-8 text-sm'
        : 'mt-3 flex-col items-end gap-y-2',
    ]"
  >
    <VNavLink
      v-for="page in allPages"
      :key="page.id"
      :link="page.link"
      :mode="mode"
      :variant="variant"
      :is-active="currentPage === page.id"
      :class="variant === 'inline' ? 'ps-3' : 'heading-5'"
      @click="onClick(page.link)"
      >{{ $t(page.name) }}</VNavLink
    >
  </ul>
</template>

<script lang="ts">
import {
  type PropType,
  defineComponent,
  useRoute,
} from '@nuxtjs/composition-api'

import usePages from '~/composables/use-pages'

import VNavLink from '~/components/VNavLink/VNavLink.vue'

export default defineComponent({
  name: 'VPageLinks',
  components: {
    VNavLink,
  },
  props: {
    /**
     * In `light` mode, the links are white and the background is dark charcoal.
     * In `dark` mode (in the modal), the links are dark charcoal and the background is transparent.
     *
     * @default 'light'
     */
    mode: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light',
    },
    /**
     * In `inline` mode, the links are displayed horizontally. It is used in the desktop header.
     * In `column` mode, the links are displayed vertically. It is used in the mobile modal.
     *
     * @default 'inline'
     */
    variant: {
      type: String as PropType<'inline' | 'column'>,
      default: 'inline',
    },
  },
  setup(_, { emit }) {
    const { all: allPages, current: currentPage } = usePages(true)
    const route = useRoute()

    const onClick = (link: string) => {
      if (link === route.value.path) {
        emit('close')
      }
    }

    return {
      allPages,
      currentPage,
      onClick,
    }
  },
})
</script>
