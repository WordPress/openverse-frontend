<template>
  <VButton
    :id="`tab-${id}`"
    ref="internalTabRef"
    role="tab"
    :tabindex="selected ? 0 : -1"
    size="disabled"
    variant="plain-dangerous"
    v-bind="tabProps"
    class="py-3 md:py-4 px-4 md:px-6 border-t border-x border-tx rounded-t-sm bg-white text-base font-semibold focus:shadow-[0_0_0_1.5px_#c52b9b_inset]"
    :class="{
      '-mb-[1px] border border-x-dark-charcoal-20 border-t-dark-charcoal-20 border-b-white bg-white':
        selected,
    }"
    @click="handleSelection"
    @focus="handleFocus"
    @mousedown="handleMouseDown"
    @keydown="handleKeyDown"
  >
    <slot />
  </VButton>
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
import { keycodes } from '~/constants/key-codes'
import { dom } from '~/utils/dom'
import { Focus, focusIn } from '~/utils/focus-management'

import VButton from '~/components/VButton.vue'

export default defineComponent({
  name: 'VTab',
  components: { VButton },
  props: {
    disabled: {
      type: [Boolean],
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const tabContext = inject(tabsContextKey)
    if (!tabContext) {
      throw new Error(`Could not resolve tabContext in VTab`)
    }

    const internalTabRef = ref<HTMLElement | null>(null)

    onMounted(() => tabContext.registerTab(internalTabRef))
    onUnmounted(() => tabContext.unregisterTab(internalTabRef))

    const tabIndex = computed(() =>
      tabContext.tabs.value.indexOf(internalTabRef)
    )

    const selected = computed(
      () => tabIndex.value === tabContext.selectedIndex.value
    )

    function handleFocus() {
      if (!tabContext) {
        throw Error('Cannot handle tab focus without tabContext')
      }
      if (props.disabled) return
      if (tabContext.activation.value === 'auto') {
        tabContext.setSelectedIndex(tabIndex.value)
      }
      dom(internalTabRef)?.focus()
    }

    function handleSelection() {
      if (props.disabled) return
      dom(internalTabRef)?.focus()
      tabContext?.setSelectedIndex(tabIndex.value)
    }

    /**
     * On click, you get a `focus` and then a `click` event. We want to only focus
     * _after_ the click event is finished(mouseup), or when the tab gets focus.

     * @param event - we want to preventDefault for this mouse event
     */
    function handleMouseDown(event: MouseEvent) {
      event.preventDefault()
    }

    function handleKeyDown(event: KeyboardEvent) {
      let list = tabContext?.tabs.value
        .map((tab) => dom(tab))
        .filter(Boolean) as HTMLElement[]
      const tabControlKeys = [
        keycodes.Spacebar,
        keycodes.Enter,
        keycodes.Home,
        keycodes.PageUp,
        keycodes.End,
        keycodes.PageDown,
        keycodes.ArrowLeft,
        keycodes.ArrowRight,
      ] as string[]

      if (!tabControlKeys.includes(event.key)) {
        return
      }
      event.preventDefault()
      event.stopPropagation()

      switch (event.key) {
        case keycodes.Spacebar:
        case keycodes.Enter:
          tabContext?.setSelectedIndex(tabIndex.value)
          break
        case keycodes.Home:
        case keycodes.PageUp:
          focusIn(list, Focus.First)
          break

        case keycodes.End:
        case keycodes.PageDown:
          focusIn(list, Focus.Last)
          break
        case keycodes.ArrowLeft:
          focusIn(list, Focus.Previous | Focus.WrapAround)
          break

        case keycodes.ArrowRight:
          focusIn(list, Focus.Next | Focus.WrapAround)
          break
      }
    }
    const controlledPanel = computed(
      () => tabContext.panels.value[tabIndex.value]?.value?.id
    )
    const tabProps = computed(() => ({
      'aria-controls': controlledPanel.value,
      'aria-selected': selected.value,
      disabled: props.disabled ? true : undefined,
    }))
    const isManual = computed(() => tabContext?.activation.value === 'manual')

    return {
      internalTabRef,
      tabProps,
      selected,
      isManual,

      handleKeyDown,
      handleFocus,
      handleMouseDown,
      handleSelection,
    }
  },
})
</script>
