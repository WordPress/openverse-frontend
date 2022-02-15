<template>
  <a target="_blank" rel="noopener noreferrer" v-on="$listeners"><slot /></a>
</template>

<script>
/**
 * This is a simple wrapper component for external links that ensures that the links
 * are set to open in a new tab and not raise an error with the current iframe setup.
 */
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'VLink',
})
</script>
