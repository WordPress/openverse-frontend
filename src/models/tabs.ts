import type { InjectionKey, Ref } from '@nuxtjs/composition-api'

export type TabsState = {
  // State
  selectedIndex: Ref<number | null>

  tabs: Ref<Ref<HTMLElement | null>[]>
  panels: Ref<Ref<HTMLElement | null>[]>

  // State mutators
  setSelectedIndex(index: number): void
  registerTab(tab: Ref<HTMLElement | null>): void
  unregisterTab(tab: Ref<HTMLElement | null>): void
  registerPanel(panel: Ref<HTMLElement | null>): void
  unregisterPanel(panel: Ref<HTMLElement | null>): void
}
export const tabsContextKey = Symbol() as InjectionKey<TabsState>
