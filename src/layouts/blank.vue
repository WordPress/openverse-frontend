<template>
  <div>
    <VMigrationNotice v-show="isReferredFromCc" />
    <VTranslationStatusBanner />
    <Nuxt />
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'

import { useNavStore } from '~/stores/nav'
import { useUsageSessionId } from '~/composables/use-usage-session-id'

import VTranslationStatusBanner from '~/components/VTranslationStatusBanner.vue'
import VMigrationNotice from '~/components/VMigrationNotice.vue'

export default defineComponent({
  name: 'Blank',
  components: { VMigrationNotice, VTranslationStatusBanner },
  setup() {
    const navStore = useNavStore()
    const isReferredFromCc = computed(() => navStore.isReferredFromCc)
    const { store } = useContext()
    useUsageSessionId(store)
    return { isReferredFromCc }
  },
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true, addDirAttribute: true })
  },
})
</script>
