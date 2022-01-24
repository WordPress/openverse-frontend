<template>
  <section :aria-label="$t('media-details.reuse.title')">
    <h3 class="text-2xl md:text-3xl mb-6">
      {{ $t('media-details.reuse.title') }}
    </h3>
    <div class="columns">
      <VMediaLicense
        :license="media.license"
        :license-url="media.license_url"
        :full-license-name="fullLicenseName"
        class="column"
      />
      <VCopyLicense
        :media="media"
        :full-license-name="fullLicenseName"
        class="column"
      />
    </div>
  </section>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { getFullLicenseName } from '~/utils/license'
import VCopyLicense from '~/components/MediaInfo/VCopyLicense.vue'
import VMediaLicense from '~/components/MediaInfo/VMediaLicense.vue'

const VMediaReuse = defineComponent({
  name: 'VMediaReuse',
  components: { VCopyLicense, VMediaLicense },
  props: {
    media: {
      type: Object,
    },
  },
  setup(props) {
    const fullLicenseName = getFullLicenseName(
      props.media.license,
      props.media.license_version
    )

    return { fullLicenseName }
  },
})
export default VMediaReuse
</script>
