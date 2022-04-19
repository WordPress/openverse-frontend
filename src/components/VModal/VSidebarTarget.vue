<template>
  <VTeleportTarget name="sidebar" element="aside" />
</template>

<script>
import VTeleportTarget from '~/components/VTeleport/VTeleportTarget.vue'

export default defineComponent({
  name: 'VSidebarTarget',
  components: { VTeleportTarget },
  props: { element: { type: String, default: 'div' } },
})
</script>
