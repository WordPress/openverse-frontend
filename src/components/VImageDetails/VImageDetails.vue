<template>
  <section class="w-full">
    <div class="flex flex-row justify-between items-center mb-6">
      <h3 class="text-2xl md:text-3xl">
        {{ $t('image-details.information.title') }}
      </h3>
      <span
        class="flex flex-row justify-end items-center text-sr text-dark-charcoal-70 font-semibold"
        >{{ $t('image-details.report.short') }} <FlagSvg class="ms-2"
      /></span>
    </div>
    <dl>
      <div>
        <dt>{{ $t('image-details.information.type') }}</dt>
        <dd>{{ image.filetype }}</dd>
      </div>
      <div>
        <dt>{{ $t('image-details.information.source') }}</dt>
        <dd>
          <a
            :href="image.foreign_landing_url"
            target="blank"
            rel="noopener noreferrer"
            class="text-pink"
            >{{ image.source }}</a
          >
        </dd>
      </div>
      <div>
        <dt>{{ $t('image-details.information.dimensions') }}</dt>
        <dd>
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          {{ image.width }} &times; {{ image.height }}
          {{ $t('photo-details.information.pixels') }}
        </dd>
      </div>
      <!-- <div>
        <dt>{{ $t("image-details.information.") }}</dt>
        <dd>{{ image. }}</dd>
      </div> -->
    </dl>
  </section>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

// import VContentReportForm from '~/components/VContentReport/VContentReportForm.vue'
import FlagSvg from '~/assets/icons/flag.svg?inline'

const VImageDetails = defineComponent({
  name: 'VImageDetails',
  components: { FlagSvg },
  props: {
    image: {
      type: Object,
      required: true,
    },
  },
})
export default VImageDetails
</script>

<style scoped>
dl {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}

dt,
dd {
  @apply text-sm;
}

dd {
  @apply font-bold mt-2 md:text-base;
}
</style>
