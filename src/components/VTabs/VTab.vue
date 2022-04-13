<template>
  <Component
    :is="as"
    ref="internalTabRef"
    class="border border-tx rounded-sm px-6 py-2 -mb-0.5 text-base font-semibold focus-visible:ring focus-visible:ring-pink"
    size="disabled"
    variant="plain"
    role="tab"
    v-bind="ourProps"
    :class="{
      'border-x-dark-charcoal-20 border-t-dark-charcoal-20 border-b-white bg-white focus-visible:border-white':
        selected,
    }"
    @click="handleSelection"
    @focus="handleFocus"
    @mousedown="handleMouseDown"
    @keydown="handleKeyDown"
  >
    <slot :selected="selected" />
  </Component>
</template>

<script lang="ts">
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
} from '@nuxtjs/composition-api'

import { tabsContextKey } from '~/models/tabs'
import { keycodes } from '~/constants/key-codes'
import { dom } from '~/utils/dom'
import { Focus, focusIn } from '~/utils/focus-management'

export default {
  name: 'VTab',
  props: {
    as: {
      type: String,
      default: 'VButton',
    },
    disabled: {
      type: [Boolean],
      default: false,
    },
  },
  setup(props) {
    const tabContext = inject(tabsContextKey)

    let random =
      Math.floor(Math.random() * 1000) +
      Math.floor(Math.random() * 100) +
      Math.floor(Math.random() * 10)
    let id = `v-tabs-tab-${random}`

    const internalTabRef = ref<HTMLElement | null>(null)

    onMounted(() => tabContext.registerTab(internalTabRef))
    onUnmounted(() => tabContext.unregisterTab(internalTabRef))

    let myIndex = computed(() => tabContext.tabs.value.indexOf(internalTabRef))

    let selected = computed(
      () => myIndex.value === tabContext.selectedIndex.value
    )

    function handleFocus() {
      dom(internalTabRef)?.focus()
    }

    function handleSelection() {
      if (props.disabled) return
      dom(internalTabRef)?.focus()
      tabContext.setSelectedIndex(myIndex.value)
    }
    // This is important because we want to only focus the tab when it gets focus
    // OR it finished the click event (mouseup). However, if you perform a `click`,
    // then you will first get the `focus` and then get the `click` event.
    function handleMouseDown(event: MouseEvent) {
      event.preventDefault()
    }
    function handleKeyDown(event: KeyboardEvent) {
      let list = tabContext.tabs.value
        .map((tab) => dom(tab))
        .filter(Boolean) as HTMLElement[]

      if (event.key === keycodes.Spacebar || event.key === keycodes.Enter) {
        event.preventDefault()
        event.stopPropagation()

        tabContext.setSelectedIndex(myIndex.value)
        return
      }

      switch (event.key) {
        case keycodes.Home:
        case keycodes.PageUp:
          event.preventDefault()
          event.stopPropagation()

          return focusIn(list, Focus.First)

        case keycodes.End:
        case keycodes.PageDown:
          event.preventDefault()
          event.stopPropagation()

          return focusIn(list, Focus.Last)
      }

      if (event.key === keycodes.ArrowLeft) {
        console.log('left clicked, will focus previous and wrap around')
        return focusIn(list, Focus.Previous | Focus.WrapAround)
      }
      if (event.key === keycodes.ArrowRight) {
        console.log('right clicked, will focus next and wrap around', list)
        return focusIn(list, Focus.Next | Focus.WrapAround)
      }
      return
    }
    const controlledPanel = computed(
      () => tabContext.panels.value[myIndex.value]?.value?.id
    )
    let ourProps = {
      id,
      role: 'tab',
      'aria-controls': controlledPanel.value,
      'aria-selected': selected.value,
      tabIndex: selected.value ? 0 : -1,
      disabled: props.disabled ? true : undefined,
    }

    return {
      ourProps,
      internalTabRef,
      selected,
      handleSelection,
      handleKeyDown,
      handleFocus,
      handleMouseDown,
    }
  },
}
</script>

<style scoped></style>
