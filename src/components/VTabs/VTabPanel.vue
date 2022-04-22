<template>
  <Component
    :is="as"
    ref="internalPanelRef"
    class="border border-dark-charcoal-20 rounded-sm p-6"
    :class="{ hidden: !selected, 'rounded-tl-none': panelIndex === 0 }"
    v-bind="ourProps"
  >
    <slot />
  </Component>
</template>
<script>
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
    for: { type: String, required: true },
  },
  setup(props) {
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
    const ourProps = computed(() => {
      const tab = tabContext.tabs.value[panelIndex.value]?.value
      const labelledBy = tab && '$el' in tab ? tab.$el.id : tab?.id

      return {
        ref: internalPanelRef,
        id: `panel-${props.for}`,
        role: 'tabpanel',
        'aria-labelledby': labelledBy,
        tabIndex: selected.value ? 0 : -1,
      }
    })
    return {
      internalPanelRef,
      selected,
      ourProps,
      panelIndex,
    }
  },
})
</script>
