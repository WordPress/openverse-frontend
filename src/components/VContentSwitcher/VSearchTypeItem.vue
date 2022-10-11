<template>
  <VItem
    :selected="selected"
    :is-first="itemId === 0"
    :as="component"
    :class="size === 'small' ? 'h-12' : 'h-16'"
    class="text-base"
    v-bind="{ href }"
    @click.native="$emit('click', item)"
  >
    <VIcon :icon-path="icon" />
    <span>{{ $t(`search-type.${item}`) }}</span>
    <VPill v-if="isBeta" class="ms-auto">{{
      $t('search-type.status-beta')
    }}</VPill>
  </VItem>
</template>

<script lang="ts">
import {
  computed,
  useContext,
  defineComponent,
  PropType,
} from '@nuxtjs/composition-api'

import { ALL_MEDIA, BETA, contentStatus, SearchType } from '~/constants/media'
import { isSearchTypeSupported, useSearchStore } from '~/stores/search'

import VIcon from '~/components/VIcon/VIcon.vue'
import VItem from '~/components/VItemGroup/VItem.vue'
import VPill from '~/components/VPill.vue'

import type { Dictionary } from 'vue-router/types/router'

export default defineComponent({
  name: 'VSearchTypeItem',
  components: { VIcon, VItem, VPill },
  props: {
    item: {
      type: String as PropType<SearchType>,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
    useLinks: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<'small' | 'medium'>,
      default: 'small',
    },
  },
  setup(props) {
    const { app } = useContext()
    const searchStore = useSearchStore()

    // Currently, there are no Beta search types, so TS raises an error saying
    // that this condition will always return false.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isBeta = computed(() => contentStatus[props.item] === BETA)

    const href = computed(() =>
      props.useLinks
        ? app.localePath({
            path: `/search/${props.item === ALL_MEDIA ? '' : props.item}`,
            query: isSearchTypeSupported(props.item)
              ? (searchStore.computeQueryParams(
                  props.item
                ) as Dictionary<string>)
              : undefined,
          })
        : undefined
    )

    /**
     * The query sets the filters that are applicable for the specific search type.
     */
    const component = computed(() => (props.useLinks ? 'VLink' : undefined))
    return {
      component,
      href,
      isBeta,
    }
  },
})
</script>
