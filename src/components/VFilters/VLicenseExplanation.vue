<template>
  <div class="license-explanation w-80 p-6">
    <h5 class="font-semibold">
      <template v-if="isLicense">{{
        $t('filters.license-explanation.license-definition')
      }}</template>
      <template v-else>{{
        $t('filters.license-explanation.mark-definition', {
          mark: license.toUpperCase(),
        })
      }}</template>
    </h5>

    <VLicenseElements size="small" class="my-4" :license="license" />

    <i18n
      :path="`filters.license-explanation.more.${
        isLicense ? 'license' : 'mark'
      }`"
      tag="p"
      class="text-sm"
    >
      <template #read-more>
        <a target="_blank" :href="`${getLicenseDeedLink(license)}`">{{
          $t('filters.license-explanation.more.read-more')
        }}</a>
      </template>
      <template #mark>{{ license.toUpperCase() }}</template>
    </i18n>
  </div>
</template>

<script>
import { isLicense } from '~/utils/license'

import VLicenseElements from '~/components/VLicenseElements.vue'

import { DEPRECATED_LICENSES } from '~/constants/license'

/**
 * Renders the explanation of the license passed to it by breaking it down to
 * its constituent clauses.
 */
export default {
  name: 'VLicenseExplanation',
  components: {
    VLicenseElements,
  },
  props: {
    /**
     * the code of the license whose elements need to be explained
     */
    license: {
      type: String,
      required: true,
    },
  },
  computed: {
    isLicense() {
      return isLicense(this.$props.license)
    },
  },
  methods: {
    getLicenseDeedLink(licenseTerm) {
      let fragment
      if (licenseTerm === 'cc0') {
        fragment = 'publicdomain/zero/1.0'
      } else if (licenseTerm === 'pdm') {
        fragment = 'publicdomain/mark/1.0'
      } else if (DEPRECATED_LICENSES.includes(licenseTerm)) {
        fragment = `licenses/${licenseTerm}/1.0`
      } else {
        fragment = `licenses/${licenseTerm}/4.0`
      }
      return `https://creativecommons.org/${fragment}/?ref=openverse&atype=rich`
    },
  },
}
</script>
