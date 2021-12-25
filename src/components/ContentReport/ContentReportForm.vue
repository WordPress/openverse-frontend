<template>
  <div id="content-report-form" class="p-4 arrow-popup">
    <button
      :aria-label="$t('photo-details.aria.close-form')"
      class="button close-button is-text tiny float-right block bg-white"
      type="button"
      @click="closeForm"
    >
      <VIcon :icon-path="closeIcon" />
    </button>
    <DmcaNotice
      v-if="showDmcaForm"
      :image-u-r-l="image.url"
      :provider-name="providerName"
      :dmca-form-url="dmcaFormUrl"
      @onBackClick="onBackClick"
    />
    <DoneMessage
      v-else-if="isDone"
      :image-u-r-l="image.url"
      :provider-name="providerName"
    />
    <ReportError v-else-if="reportFailed" @back-click="backToReportStart" />

    <OtherIssueForm
      v-else-if="showOtherForm"
      @onBackClick="onBackClick"
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
            v-model="reasonSelected"
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
        :disabled="!reasonSelected"
        class="float-end bg-trans-blue text-white py-2 px-4 font-semibold border-2 border-tx rounded-sm disabled:opacity-50"
        @click="onIssueSelected"
      >
        {{ $t('photo-details.content-report.next') }}
      </button>
    </form>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import DmcaNotice from './DmcaNotice'
import OtherIssueForm from './OtherIssueForm'
import DoneMessage from './DoneMessage'
import ReportError from './ReportError'
import ReportService from '~/data/report-service'

import closeIcon from '~/assets/icons/close.svg'
import VIcon from '~/components/VIcon/VIcon.vue'

const dmcaFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSd0I8GsEbGQLdaX4K_F6V2NbHZqN137WMZgnptUpzwd-kbDKA/viewform'
const reasons = {
  DMCA: 'dmca',
  MATURE: 'mature',
  OTHER: 'other',
}
const statuses = {
  SENT: 'sent',
  FAILED: 'failed',
  OPEN: 'open',
}

export default defineComponent({
  name: 'ContentReportForm',
  components: {
    DoneMessage,
    DmcaNotice,
    ReportError,
    OtherIssueForm,
    VIcon,
  },
  props: ['image', 'providerName', 'reportServiceProp'],
  setup(props, { emit }) {
    const selectedReason = ref(null)
    const selectedOther = ref(false)
    const selectedCopyright = ref(false)
    const reportStatus = ref(statuses.OPEN)
    const reasonSelected = ref(null)

    const reportService = props.reportServiceProp || ReportService
    const onIssueSelected = (val) => {
      reasonSelected.value = val
      if (![reasons.OTHER, reasons.DMCA].includes(val)) {
        sendContentReport({})
      }
      if (selectedReason.value === 'other') {
        selectedOther.value = true
      } else if (selectedReason === 'dmca') {
        selectedCopyright.value = true
      } else {
        sendContentReport({})
      }
    }
    const onBackClick = () => {
      selectedOther.value = false
      selectedCopyright.value = false
    }
    const backToReportStart = () => {
      reportStatus.value = statuses.OPEN
    }
    const sendContentReport = async ({ description = '' }) => {
      try {
        await reportService.sendReport({
          identifier: props.image.id,
          reason: selectedReason.value,
          description,
        })
        reportStatus.value = statuses.SENT
      } catch (error) {
        reportStatus.value = statuses.FAILED
      }
    }
    const closeForm = () => {
      reportStatus.value = statuses.OPEN
      emit('close-form')
    }
    const reportFailed = computed(() => reportStatus.value === statuses.FAILED)
    const isDone = computed(
      () =>
        reportStatus.value === statuses.SENT &&
        !(reasonSelected.value === reasons.DMCA)
    )
    const showOtherForm = computed(() => reasonSelected.value === reasons.OTHER)
    const showDmcaForm = computed(() => reasonSelected.value === reasons.DMCA)
    return {
      reasonSelected,
      selectedOther,
      selectedCopyright,
      reportService,
      closeIcon,
      dmcaFormUrl,
      isDone,
      reportFailed,
      closeForm,
      onIssueSelected,
      onBackClick,
      sendContentReport,
      backToReportStart,
      showOtherForm,
      showDmcaForm,
      reasons: Object.values(reasons),
    }
  },
})
</script>
