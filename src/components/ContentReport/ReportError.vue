<template>
  <div>
    <span class="is-block px-big mt-large has-text-centered">
      {{ $t('photo-details.content-report.dmca.error') }}
    </span>
    <button
      class="button is-text tiny mt-normal is-shadowless"
      @click="onBackClick()"
      @keyup.enter="onBackClick()"
    >
      <span>
        <i class="icon chevron-left mr-small" />
        {{ $t('photo-details.content-report.back') }}
      </span>
    </button>
  </div>
</template>

<script>
import { BACK_TO_REPORT_START } from '~/store-modules/mutation-types'

export default {
  name: 'ReportError',
  methods: {
    onBackClick() {
      this.$store.commit(BACK_TO_REPORT_START)
    },
  },
}
</script>
