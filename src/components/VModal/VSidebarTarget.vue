<template>
  <VTeleportTarget name="sidebar" />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import VTeleportTarget from '~/components/VTeleport/VTeleportTarget.vue'

export default defineComponent({
  name: 'VSidebarTarget',
  components: { VTeleportTarget },
})
</script>
