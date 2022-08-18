<template>
  <section
    :aria-label="$t('media-details.reuse.title').toString()"
    class="media-reuse"
  >
    <h3 class="mb-6 text-2xl md:text-3xl">
      {{ $t('media-details.reuse.title') }}
    </h3>
    <div class="grid gap-6 md:grid-cols-2">
      <VMediaLicense
        :license="media.license"
        :license-url="licenseUrl"
        :full-license-name="fullLicenseName"
      />
      <VCopyLicense :media="media" />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { getFullLicenseName, getLicenseUrl } from '~/utils/license'

import type { Media } from '~/models/media'

import { useI18n } from '~/composables/use-i18n'

import VCopyLicense from '~/components/VMediaInfo/VCopyLicense.vue'
import VMediaLicense from '~/components/VMediaInfo/VMediaLicense.vue'

export default defineComponent({
  name: 'VMediaReuse',
  components: { VCopyLicense, VMediaLicense },
  props: {
    media: {
      type: Object as PropType<Media>,
      required: true,
    },
  },
  setup(props) {
    const i18n = useI18n()

    const licenseUrl = computed(
      () =>
        props.media.license_url ??
        getLicenseUrl(props.media.license, props.media.license_version)
    )
    const fullLicenseName = computed(() =>
      getFullLicenseName(props.media.license, props.media.license_version, i18n)
    )

    return { licenseUrl, fullLicenseName }
  },
})
</script>
