<template>
  <HeroSection />
</template>

<script>
import { RESET_FILTERS } from '~/constants/action-types'
import iframeHeight from '~/mixins/iframe-height'
import i18nSync from '~/mixins/i18n-sync'
import { FILTER } from '~/constants/store-modules'

const HomePage = {
  name: 'home-page',
  mixins: [iframeHeight, i18nSync],
  layout({ store }) {
    return store.state.nav.isEmbedded ? 'embedded' : 'default'
  },
  beforeMount() {
    this.$store.dispatch(`${FILTER}/${RESET_FILTERS}`)
  },
}

export default HomePage
</script>
