import { defineNuxtPlugin } from '#app'
import abTests, { activeExperiments } from '~/ab-tests'

export default defineNuxtPlugin((nuxtApp) => {
  if (activeExperiments.length > 0) {
    abTests(nuxtApp.$store, activeExperiments)
  }
})
