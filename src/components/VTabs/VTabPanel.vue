<template>
  <Component
    :is="as"
    ref="internalPanelRef"
    class="border border-dark-charcoal-20 rounded-sm p-6"
    :class="{ hidden: !selected }"
    v-bind="ourProps"
  >
    <slot />
  </Component>
</template>
<script>
import {
  inject,
  onMounted,
  onUnmounted,
  ref,
  defineComponent,
  computed,
} from '@nuxtjs/composition-api'

import { tabsContextKey } from '~/models/tabs'

export default defineComponent({
  name: 'VTabPanel',
  props: {
    as: { type: String, default: 'div' },
  },
  setup() {
    const tabContext = inject(tabsContextKey)

    const internalPanelRef = ref(null)
    let random =
      Math.floor(Math.random() * 1000) +
      Math.floor(Math.random() * 100) +
      Math.floor(Math.random() * 10)
    let id = `v-tab-panel${random}`

    onMounted(() => {
      tabContext.registerPanel(internalPanelRef)
    })
    onUnmounted(() => tabContext.unregisterPanel(internalPanelRef))
    let myIndex = computed(() =>
      tabContext.panels.value.indexOf(internalPanelRef)
    )
    let selected = computed(
      () => myIndex.value === tabContext.selectedIndex.value
    )
    let ourProps = {
      ref: internalPanelRef,
      id,
      role: 'tabpanel',
      'aria-labelledby': tabContext.tabs.value[myIndex.value]?.value?.id,
      tabIndex: selected.value ? 0 : -1,
    }
    return {
      internalPanelRef,
      selected,
      ourProps,
    }
  },
})
</script>
