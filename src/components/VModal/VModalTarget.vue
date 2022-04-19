<template>
  <VTeleportTarget name="modal" />
</template>

<script>
import VTeleportTarget from '~/components/VTeleport/VTeleportTarget.vue'

export default defineComponent({
  name: 'VModalTarget',
  components: { VTeleportTarget },
})
</script>
