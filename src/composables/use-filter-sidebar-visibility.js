import { onMounted, useState } from '#app'
import local from '~/utils/local'
import { isMinScreen } from '~/composables/use-media-query'

/**
 * This composable keeps track of whether the filters (sidebar or modal) should be visible.
 * @param {object} props
 * @param {import('#app').Ref<boolean>} [props.mediaQuery=isMinScreen('md')] - the minimum media query at which
 * the filters are shown as sidebar instead of the full-page modal.
 * @returns {{isVisible: import('#app').Ref<boolean>, setVisibility: (val: boolean) => void}}
 */
export function useFilterSidebarVisibility({ mediaQuery } = {}) {
  const isVisible = useState('sidebar-visibility', () => false)
  if (!mediaQuery) {
    mediaQuery = isMinScreen('md')
  }
  /**
   * Open or close the filter sidebar
   * @param {boolean} val
   */
  const setVisibility = (val) => {
    isVisible.value = val
    local.set(process.env.filterStorageKey, val)
  }

  onMounted(() => {
    const localFilterState = () =>
      local.get(process.env.filterStorageKey) === 'true'
    setVisibility(mediaQuery.value && localFilterState())
  })

  return {
    isVisible,
    setVisibility,
  }
}
