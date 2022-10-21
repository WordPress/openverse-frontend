<template>
  <VButton
    v-bind="$attrs"
    :aria-label="$t('search.search')"
    size="disabled"
    :variant="route === 'home' ? 'primary' : 'plain'"
    class="heading-6 border-s-tx flex-shrink-0 transition-none rounded-s-none"
    :class="[
      sizeClasses,
      route === 'home'
        ? 'h-full whitespace-nowrap text-white md:py-6 md:px-10'
        : 'search-button ps-[1.5px] border-dark-charcoal-20 p-[0.5px] -ms-1 border-s hover:bg-pink hover:text-white focus-visible:bg-pink focus-visible:text-white',
      {
        'group-hover:border-pink group-hover:bg-pink group-hover:text-white':
          route === '404',
      },
    ]"
    v-on="$listeners"
  >
    <VIcon
      class="flex"
      :class="{ 'md:hidden': route === 'home' }"
      :icon-path="searchIcon"
    />
    <span class="hidden" :class="{ 'md:flex': route === 'home' }">{{
      $t('search.search')
    }}</span>
  </VButton>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  inject,
} from '@nuxtjs/composition-api'

import { IsMinScreenMdKey } from '~/types/provides'
import { isMinScreen } from '~/composables/use-media-query'

import VIcon from '~/components/VIcon/VIcon.vue'
import VButton from '~/components/VButton.vue'
import type { FieldSize } from '~/components/VInputFieldOld/VInputFieldOld.vue'

import searchIcon from '~/assets/icons/search.svg'
/**
 * Displays a search button at the end of the search bar.
 * It displays the text 'Search' on the homepage on screens above `md`,
 * or a search icon in other cases.
 * The button uses `primary` variant on the homepage; on other pages it is
 * `plain` when resting, and pink on hover/focus/active.
 *
 */
export default defineComponent({
  name: 'VSearchButtonOld',
  components: { VIcon, VButton },
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<FieldSize>,
      required: true,
    },
    route: {
      type: String as PropType<'home' | '404' | 'search'>,
      validator: (v: string) => ['home', '404', 'search'].includes(v),
    },
  },
  setup(props) {
    const isMinScreenMd = inject(IsMinScreenMdKey, isMinScreen('md'))

    const isIcon = computed(
      () => props.route !== 'home' || !isMinScreenMd.value
    )

    const sizeClasses = computed(() => {
      return isIcon.value
        ? {
            small: 'w-10 md:w-12 h-10 md:h-12',
            medium: 'w-12 h-12',
            large: 'w-14 h-14',
            standalone: 'w-[57px] md:w-[69px] h-full',
          }[props.size]
        : undefined
    })

    return { searchIcon, sizeClasses, isIcon }
  },
})
</script>
<style scoped>
/* Negative margin removes a tiny gap between the button and the input borders. */
.search-button {
  margin-inline-start: -1px;
  border-inline-start-color: transparent;
}
</style>
