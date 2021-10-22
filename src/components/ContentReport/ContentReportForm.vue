<template>
  <div id="content-report-form" class="p-4 arrow-popup">
    <button
      :aria-label="$t('photo-details.aria.close-form')"
      class="button close-button is-text tiny float-right block bg-white"
      type="button"
      @click="closeForm()"
    >
      <i class="icon cross" />
    </button>
    <DmcaNotice
      v-if="selectedCopyright"
      :image-u-r-l="image.url"
      :provider-name="providerName"
      :dmca-form-url="dmcaFormUrl"
      @onBackClick="onBackClick()"
    />
    <DoneMessage
      v-else-if="!selectedCopyright && isReportSent"
      :image-u-r-l="image.url"
      :provider-name="providerName"
    />
    <ReportError v-else-if="reportFailed" @back-click="backToReportStart" />

    <OtherIssueForm
      v-else-if="selectedOther"
      @onBackClick="onBackClick()"
      @sendContentReport="sendContentReport"
    />
    <form v-else>
      <h5 class="b-header mb-4">
        {{ $t('photo-details.content-report.title') }}
      </h5>
      <fieldset class="mb-4">
        <legend class="mb-4">
          {{ $t('photo-details.content-report.issue') }}
        </legend>

        <div>
          <label for="dmca" class="ms-2">
            <input
              id="dmca"
              v-model="selectedReason"
              type="radio"
              name="type"
              value="dmca"
            />
            {{ $t('photo-details.content-report.copyright') }}
          </label>
        </div>

        <div>
          <label for="mature" class="ms-2">
            <input
              id="mature"
              v-model="selectedReason"
              type="radio"
              name="type"
              value="mature"
            />
            {{ $t('photo-details.content-report.mature') }}
          </label>
        </div>

        <div>
          <label for="other" class="ms-2">
            <input
              id="other"
              v-model="selectedReason"
              type="radio"
              name="type"
              value="other"
            />
            {{ $t('photo-details.content-report.other') }}
          </label>
        </div>
      </fieldset>

      <p class="caption font-semibold text-gray mb-4">
        {{ $t('photo-details.content-report.caption') }}
      </p>

      <button
        type="button"
        :disabled="selectedReason === null"
        class="button next-button tiny is-success float-right"
        @click="onIssueSelected()"
        @keyup.enter="onIssueSelected()"
      >
        {{ $t('photo-details.content-report.next') }}
      </button>
    </form>
  </div>
</template>

<script>
import dmcaNotice from './DmcaNotice'
import OtherIssueForm from './OtherIssueForm'
import DoneMessage from './DoneMessage'
import ReportError from './ReportError'
import { PROVIDER } from '~/constants/store-modules'
import { mapGetters } from 'vuex'
import ReportService from '~/data/report-service'

const dmcaFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSd0I8GsEbGQLdaX4K_F6V2NbHZqN137WMZgnptUpzwd-kbDKA/viewform'

export default {
  name: 'ContentReportForm',
  components: {
    DoneMessage,
    dmcaNotice,
    ReportError,
    OtherIssueForm,
  },
  props: ['image', 'imageId'],
  data() {
    return {
      selectedReason: null,
      selectedOther: false,
      selectedCopyright: false,
      dmcaFormUrl,
      isReportSent: false,
      reportFailed: false,
    }
  },
  computed: {
    ...mapGetters(PROVIDER, ['getProviderName']),
    providerName() {
      return this.getProviderName(this.image.provider)
    },
  },
  methods: {
    onIssueSelected() {
      if (this.selectedReason === 'other') {
        this.selectedOther = true
      } else if (this.selectedReason === 'dmca') {
        this.selectedCopyright = true
      } else {
        this.sendContentReport()
      }
    },
    onBackClick() {
      this.selectedOther = false
      this.selectedCopyright = false
    },
    backToReportStart() {
      this.reportFailed = false
      this.isReportSent = false
    },
    async sendContentReport(description = '') {
      try {
        console.log(this.$props.image, this.$props.imageId)
        await ReportService.sendReport({
          identifier: this.$props.imageId,
          reason: this.selectedReason,
          description,
        })
        this.isReportSent = true
      } catch (error) {
        this.reportFailed = true
      }
    },
    closeForm() {
      this.isReportSent = false
      this.reportFailed = false
      this.$emit('close-form')
    },
  },
}
</script>
