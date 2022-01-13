<template>
  <div class="w-full">
    <div class="flex justify-between">
      <h5>{{ $t(`media-details.${mediaType}-info`) }}</h5>
      <span class="flex"
        >{{ $t('media-details.content-report.report') }} <FlagSvg
      /></span>
    </div>
    <p>Media details goes here.</p>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

// import VContentReportForm from '~/components/VContentReport/VContentReportForm.vue'
import FlagSvg from '~/assets/icons/flag.svg?inline'

export default defineComponent({
  name: 'VMediaInfo',
  components: { FlagSvg },
  props: {
    mediaType: {
      type: String,
      required: true,
    },
    media: {
      type: Object,
      required: true,
    },
  },
})
</script>
