<template>
  <div role="tablist" :aria-label="label">
    <div class="flex flex-row">
      <slot name="tabs" />
    </div>
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  provide,
  ref,
  watchEffect,
} from '@nuxtjs/composition-api'

import { dom } from '~/utils/dom'

import { tabsContextKey, TabsState } from '~/models/tabs'

export default defineComponent({
  name: 'VTabs',
  props: {
    label: {
      type: String,
      required: true,
    },
    selectedIndex: {
      type: Number as PropType<number | null>,
      default: null,
    },
    defaultIndex: {
      type: [Number],
      default: 0,
    },
  },
  setup(props, { emit }) {
    const selectedIndex = ref<TabsState['selectedIndex']['value']>(null)
    const tabs = ref<TabsState['tabs']['value']>([])
    const panels = ref<TabsState['panels']['value']>([])
    const tabGroupContext = {
      selectedIndex,
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

    watchEffect(() => {
      if (tabGroupContext.tabs.value.length <= 0) return
      if (props.selectedIndex === null && selectedIndex.value !== null) return
      let tabs = tabGroupContext.tabs.value
        .map((tab) => dom(tab))
        .filter(Boolean) as HTMLElement[]
      let focusableTabs = tabs.filter((tab) => !tab.hasAttribute('disabled'))

      let indexToSet = props.selectedIndex ?? props.defaultIndex
      // Underflow
      if (indexToSet < 0) {
        selectedIndex.value = tabs.indexOf(focusableTabs[0])
      }

      // Overflow
      else if (indexToSet > tabGroupContext.tabs.value.length) {
        selectedIndex.value = tabs.indexOf(
          focusableTabs[focusableTabs.length - 1]
        )
      }

      // Middle
      else {
        let before = tabs.slice(0, indexToSet)
        let after = tabs.slice(indexToSet)

        let next = [...after, ...before].find((tab) =>
          focusableTabs.includes(tab)
        )
        if (!next) return

        selectedIndex.value = tabs.indexOf(next)
      }
    })
    return {
      tabs,
    }
  },
})
</script>
