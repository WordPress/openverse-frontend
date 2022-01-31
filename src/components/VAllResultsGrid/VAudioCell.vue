<template>
  <VAudioTrack
    :audio="audio"
    layout="box"
    size="full"
    @boxedAudioClick="navigateToSinglePage"
  />
</template>

<script>
import { defineComponent, useRouter } from '#app'
import { useApp } from '~/composables/use-app'
import VAudioTrack from '~/components/VAudioTrack/VAudioTrack.vue'

export default defineComponent({
  components: { VAudioTrack },
  props: ['audio'],
  setup() {
    const app = useApp()
    const router = useRouter()
    const navigateToSinglePage = (audio) => {
      router.push(app.localePath({ path: `/audio/${audio.id}` }))
    }

    return {
      navigateToSinglePage,
    }
  },
})
</script>
