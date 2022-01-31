<template>
  <VTeleportTarget name="sidebar" element="aside" />
</template>

<script>
import { defineComponent } from '#app'
import VTeleportTarget from '~/components/VTeleport/VTeleportTarget.vue'

export default defineComponent({
  name: 'VSidebarTarget',
  components: { VTeleportTarget },
  props: { element: { type: String, default: 'div' } },
})
</script>
