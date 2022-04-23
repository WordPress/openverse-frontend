<template>
  <Component
    :is="as"
    :id="`panel-${id}`"
    ref="internalPanelRef"
    class="border border-dark-charcoal-20 rounded-sm p-6"
    :class="{ hidden: !selected, 'rounded-tl-none': panelIndex === 0 }"
    role="tabpanel"
    :tabindex="selected ? 0 : -1"
    :aria-labelledby="`tab-${id}`"
  >
    <slot />
  </Component>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  ref,
} from '@nuxtjs/composition-api'

import { tabsContextKey } from '~/models/tabs'

export default defineComponent({
  name: 'VTabPanel',
  props: {
    as: { type: String, default: 'div' },
    id: { type: String, required: true },
  },
  setup() {
    const tabContext = inject(tabsContextKey)
    if (!tabContext) {
      throw new Error(`Could not resolve tabContext in VTabPanel`)
    }
    const internalPanelRef = ref(null)

    onMounted(() => {
      tabContext.registerPanel(internalPanelRef)
    })
    onUnmounted(() => tabContext.unregisterPanel(internalPanelRef))
    const panelIndex = computed(() =>
      tabContext.panels.value.indexOf(internalPanelRef)
    )
    const selected = computed(() => {
      return panelIndex.value === tabContext.selectedIndex.value
    })

    return {
      internalPanelRef,
      selected,
      panelIndex,
    }
  },
})
</script>
