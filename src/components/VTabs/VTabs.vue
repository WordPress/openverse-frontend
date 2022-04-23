<template>
  <div :aria-label="label">
    <div role="tablist" class="flex flex-row">
      <slot name="tabs" />
    </div>
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  ref,
} from '@nuxtjs/composition-api'

import { tabsContextKey, TabsState } from '~/models/tabs'

export default defineComponent({
  name: 'VTabs',
  props: {
    label: {
      type: String,
      required: true,
    },
    manual: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selectedIndex = ref<TabsState['selectedIndex']['value']>(0)
    const tabs = ref<TabsState['tabs']['value']>([])
    const panels = ref<TabsState['panels']['value']>([])
    const tabGroupContext = {
      selectedIndex,
      activation: computed(() => (props.manual ? 'manual' : 'auto')),
      tabs,
      panels,
      setSelectedIndex(index: number) {
        if (selectedIndex.value === index) return
        selectedIndex.value = index
        emit('change', index)
      },
      registerTab(tab: typeof tabs['value'][number]) {
        if (!tabs.value.includes(tab)) tabs.value.push(tab)
      },
      unregisterTab(tab: typeof tabs['value'][number]) {
        let idx = tabs.value.indexOf(tab)
        if (idx !== -1) tabs.value.splice(idx, 1)
      },
      registerPanel(panel: typeof panels['value'][number]) {
        if (!panels.value.includes(panel)) panels.value.push(panel)
      },
      unregisterPanel(panel: typeof panels['value'][number]) {
        let idx = panels.value.indexOf(panel)
        if (idx !== -1) panels.value.splice(idx, 1)
      },
    }
    provide(tabsContextKey, tabGroupContext)
  },
})
</script>
