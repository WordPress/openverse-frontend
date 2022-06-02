<template>
  <VAudioTrack :audio="audio" layout="box" />
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

import { AudioDetail } from '~/models/media'

import VAudioTrack from '~/components/VAudioTrack/VAudioTrack.vue'

export default defineComponent({
  components: { VAudioTrack },
  props: {
    audio: {
      type: Object as PropType<AudioDetail>,
    },
  },
})
</script>
