<template>
  <div>
    <p>{{ wow }}</p>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'VAllGrid',
  setup() {
    return {
      wow: 'cool!',
    }
  },
})
</script>
