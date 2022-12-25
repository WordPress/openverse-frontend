import { ref, onMounted } from "@nuxtjs/composition-api"

import { useLayout } from "~/composables/use-layout"

export const WithUiStore = (story) => {
  return {
    template: `<div ref="element"><story /></div>`,
    components: { story },
    setup() {
      const element = ref()
      const { updateBreakpoint } = useLayout()
      onMounted(() => {
        updateBreakpoint()
      })
      return { element }
    },
  }
}
