import { computed, ref } from '@nuxtjs/composition-api'
import { isScreen } from '~/composables/use-media-query'

/** @type {import('@nuxtjs/composition-api').Ref<null|'filters'|'content-switcher'>} */
export const currentOverlay = ref(null)

export const useOverlay = () => {
  const isMdScreen = isScreen('md')

  /**
   * When an overlay is opened on mobile, this sets the current overlay name
   * @param {'filters'|'content-switcher'} overlay
   */
  const openOverlay = (overlay) => {
    if (!isMdScreen.value) {
      currentOverlay.value = overlay
    }
  }
  const closeOverlay = () => {
    currentOverlay.value = null
  }
  return {
    currentOverlay,
    openOverlay,
    closeOverlay,
    showOverlay: computed(() => currentOverlay.value !== null),
  }
}
