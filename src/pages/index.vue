<template>
  <HeroSection />
</template>

<script>
import { RESET_FILTERS } from '~/constants/action-types'
import { FILTER } from '~/constants/store-modules'

const HomePage = {
  name: 'home-page',
  layout({ store }) {
    return store.state.nav.isEmbedded ? 'embedded' : 'default'
  },
  beforeMount() {
    this.$store.dispatch(`${FILTER}/${RESET_FILTERS}`)
  },
}

export default HomePage
</script>
