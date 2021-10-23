<template>
  <div id="content-report-form" class="p-4 arrow-popup">
    <button
      :aria-label="$t('photo-details.aria.close-form')"
      class="button close-button is-text tiny float-right block bg-white"
      type="button"
      @click="closeForm()"
    >
      <CloseIcon width="24" height="24" />
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
      <fieldset class="mb-4 flex flex-col">
        <legend class="mb-4">
          {{ $t('photo-details.content-report.issue') }}
        </legend>
        <label
          v-for="reason in reasons"
          :key="reason"
          :for="reason"
          class="ms-2 mb-2"
        >
          <input
            :id="reason"
            v-model="selectedReason"
            type="radio"
            name="type"
            :value="reason"
          />
          {{ $t(`photo-details.content-report.${reason}`) }}
        </label>
      </fieldset>

      <p class="caption font-semibold text-gray mb-4">
        {{ $t('photo-details.content-report.caption') }}
      </p>

      <button
        type="button"
        :disabled="selectedReason === null"
        class="float-end bg-trans-blue text-white py-2 px-4 font-semibold border-2 border-tx rounded-sm disabled:opacity-50"
        @click="onIssueSelected()"
        @keyup.enter="onIssueSelected()"
      >
        {{ $t('photo-details.content-report.next') }}
      </button>
    </form>
  </div>
</template>

<script>
import CloseIcon from '~/assets/icons/close.svg?inline'
import DmcaNotice from './DmcaNotice'
import OtherIssueForm from './OtherIssueForm'
import DoneMessage from './DoneMessage'
import ReportError from './ReportError'
import ReportService from '~/data/report-service'

const dmcaFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSd0I8GsEbGQLdaX4K_F6V2NbHZqN137WMZgnptUpzwd-kbDKA/viewform'

export default {
  name: 'ContentReportForm',
  components: {
    DoneMessage,
    DmcaNotice,
    ReportError,
    OtherIssueForm,
    CloseIcon,
  },
  props: ['image', 'providerName', 'reportServiceProp'],
  data() {
    return {
      selectedReason: null,
      selectedOther: false,
      selectedCopyright: false,
      dmcaFormUrl,
      isReportSent: false,
      reportFailed: false,
      reasons: ['dmca', 'mature', 'other'],
    }
  },
  computed: {
    reportService() {
      return this.reportServiceProp ? this.reportServiceProp : ReportService
    },
  },
  methods: {
    onIssueSelected() {
      if (this.selectedReason === 'other') {
        this.selectedOther = true
      } else if (this.selectedReason === 'dmca') {
        this.selectedCopyright = true
      } else {
        this.sendContentReport({})
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
    async sendContentReport({ description = '' }) {
      try {
        await this.reportService.sendReport({
          identifier: this.$props.image.id,
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
