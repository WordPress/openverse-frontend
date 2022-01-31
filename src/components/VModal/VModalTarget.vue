<template>
  <VTeleportTarget name="modal" />
</template>

<script>
import { defineComponent } from '#app'
import VTeleportTarget from '~/components/VTeleport/VTeleportTarget'

export default defineComponent({
  name: 'VModalTarget',
  components: { VTeleportTarget },
})
</script>
