import { onMounted, Ref, ref } from '@nuxtjs/composition-api'

import { env } from '~/utils/env'
import local from '~/utils/local'
import { isMinScreen } from '~/composables/use-media-query'

/**
 * This global ref is SSR safe because it will only
 * change internal value based on client side interaction.
 *
 */
const isVisible = ref<boolean>(false)

/**
 * This composable keeps track of whether the filters (sidebar or modal) should be visible.
 * @param mediaQuery - the minimum media query at which
 * the filters are shown as sidebar instead of the full-page modal.
 */
export const useFilterSidebarVisibility = ({
  mediaQuery,
}: { mediaQuery?: Ref<boolean> } = {}) => {
  const _mediaQuery = mediaQuery ? mediaQuery : isMinScreen('md')

  /**
   * Open or close the filter sidebar
   * @param val - whether to set the sidebar visible.
   */
  const setVisibility = (val: boolean) => {
    isVisible.value = val
    local.setItem(env.filterStorageKey, String(val))
  }

  onMounted(() => {
    const localFilterState = () =>
      local.getItem(env.filterStorageKey) === 'true'
    setVisibility(_mediaQuery.value && localFilterState())
  })

  return {
    isVisible,
    setVisibility,
  }
}
