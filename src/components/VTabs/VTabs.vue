<template>
  <div>
    <div class="flex flex-row">
      <slot name="tabs" />
    </div>
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  ref,
  watchEffect,
} from '@nuxtjs/composition-api'

import { dom } from '~/utils/dom'

import { tabsContextKey, TabsState } from '../../models/tabs'

export default defineComponent({
  name: 'VTabs',
  props: {
    selectedIndex: {
      type: [Number],
      default: null,
    },
    defaultIndex: {
      type: [Number],
      default: 0,
    },
  },
  setup(props, { emit }) {
    let selectedIndex = ref<TabsState['selectedIndex']['value']>(null)
    let tabs = ref<TabsState['tabs']['value']>([])
    let panels = ref<TabsState['panels']['value']>([])
    let tabGroupContext = {
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
      console.log(
        'something changed',
        tabGroupContext.tabs.value,
        props.selectedIndex,
        selectedIndex.value
      )
      if (tabGroupContext.tabs.value.length <= 0) return
      if (props.selectedIndex === null && selectedIndex.value !== null) return
      console.log('did not return')
      let tabs = tabGroupContext.tabs.value
        .map((tab) => dom(tab))
        .filter(Boolean) as HTMLElement[]
      let focusableTabs = tabs.filter((tab) => !tab.hasAttribute('disabled'))

      let indexToSet = props.selectedIndex ?? props.defaultIndex
      console.log('indexToSet', indexToSet)
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
