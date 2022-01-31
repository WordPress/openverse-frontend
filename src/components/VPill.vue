<template>
  <div
    class="bg-yellow uppercase w-min px-2 py-1 text-sm font-semibold rounded-sm"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent } from '#app'

export default defineComponent({
  name: 'VPill',
})
</script>
