import { computed, Ref, ref } from "@nuxtjs/composition-api"

import { useSearchStore } from "~/stores/search"
import { keycodes } from "~/constants/key-codes"
import { cyclicShift } from "~/utils/math"
import { ensureFocus } from "~/utils/reakit-utils/focus"

export const useRecentSearches = ({
  searchTerm,
  searchInput,
}: {
  searchTerm: Ref<string>
  searchInput: Ref<HTMLInputElement | null>
}) => {
  const searchStore = useSearchStore()
  /**
   * Refers to the current suggestion that has visual focus (not DOM focus)
   * and is the active descendant. This should be set to `undefined` when the
   * visual focus is on the input field.
   */
  const selectedIdx = ref<number | undefined>(undefined)
  const entries = computed(() => searchStore.recentSearches)

  const isRecentVisible = ref(false)

  /**
   * Show and hide recent searches.
   */
  const showRecentSearches = () => {
    isRecentVisible.value = true
  }
  const hideRecentSearches = () => {
    isRecentVisible.value = false
  }

  const handleVerticalArrows = (event: KeyboardEvent) => {
    event.preventDefault() // Prevent the cursor from moving horizontally.
    const { key, altKey } = event
    // Show the recent searches.
    showRecentSearches()
    if (altKey) return
    // Shift selection (if Alt was not pressed with arrow keys)
    let defaultValue: number
    let offset: number
    if (key == keycodes.ArrowUp) {
      defaultValue = 0
      offset = -1
    } else {
      defaultValue = -1
      offset = 1
    }
    selectedIdx.value = cyclicShift(
      selectedIdx.value ?? defaultValue,
      offset,
      0,
      entries.value.length
    )
  }
  const handleOtherKeys = (event: KeyboardEvent) => {
    const { key } = event
    if (key === keycodes.Enter && selectedIdx.value)
      // If a recent search is selected, populate its value into the input.
      searchTerm.value = entries.value[selectedIdx.value]
    if (([keycodes.Escape] as string[]).includes(key))
      // Hide the recent searches.
      hideRecentSearches()
    selectedIdx.value = undefined // Lose visual focus from entries.
  }
  const handleKeydown = (event: KeyboardEvent) => {
    const { key } = event
    return ([keycodes.ArrowUp, keycodes.ArrowDown] as string[]).includes(key)
      ? handleVerticalArrows(event)
      : handleOtherKeys(event)
  }
  /* Populate the input with the clicked entry and execute the search. */
  const handleSelect = (idx: number) => {
    searchTerm.value = entries.value[idx]
    hideRecentSearches()
    selectedIdx.value = undefined // Lose visual focus from entries.
  }

  /* Clear all recent searches from the store. */
  const handleClear = () => {
    searchStore.clearRecentSearches()
    if (searchInput.value) {
      ensureFocus(searchInput.value)
    }
  }

  return {
    isRecentVisible,
    showRecentSearches,
    hideRecentSearches,

    selectedIdx,
    entries,

    handleKeydown,
    handleSelect,
    handleClear,
  }
}
