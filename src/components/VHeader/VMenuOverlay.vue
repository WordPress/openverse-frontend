<template>
  <div class="bg-red w-full h-full">
    {{ currentOverlay }}
    <VContentTypePopover v-if="currentOverlay === 'content-switcher'" />
    <VPageMenuPopover v-if="currentOverlay === 'content-switcher'" />
  </div>
</template>

<script>
import { useOverlay } from '~/composables/use-overlay'
import VContentTypePopover from '~/components/VHeader/VContentTypePopover'
import VPageMenuPopover from '~/components/VHeader/VPageMenuPopover'

export default {
  name: 'VMenuOverlay',
  components: {
    VContentTypePopover,
    VPageMenuPopover,
  },
  setup() {
    const { currentOverlay } = useOverlay()

    return { currentOverlay }
  },
}
</script>
