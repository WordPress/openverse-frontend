<template>
  <div id="content-report-form" class="w-80 p-6">
    <div v-if="status === statuses.SENT">
      <p class="font-semibold text-2xl mb-4">
        {{ $t('media-details.content-report.success.title') }}
      </p>
      <i18n
        path="media-details.content-report.success.note"
        class="text-sm"
        tag="p"
      >
        <template #source>
          <a
            :href="media.url"
            class="text-pink hover:underline"
            target="_blank"
            rel="noopener"
            >{{ providerName }}</a
          >
        </template>
      </i18n>
    </div>

    <div v-else-if="status === statuses.FAILED">
      <p class="font-semibold text-2xl mb-4">
        {{ $t('media-details.content-report.failure.title') }}
      </p>
      <p class="text-sm">
        {{ $t('media-details.content-report.failure.note') }}
      </p>
    </div>

    <!-- Main form -->
    <div v-else>
      <div class="font-semibold text-2xl mb-4">
        {{ $t('media-details.content-report.long') }}
      </div>

      <p class="text-sm mb-4">
        {{ $t('media-details.content-report.form.disclaimer') }}
      </p>

      <form class="text-sm">
        <fieldset class="mb-4 flex flex-col">
          <legend class="font-semibold mb-4">
            {{ $t('media-details.content-report.form.question') }}
          </legend>
          <template v-for="reason in reasons">
            <VRadio
              :id="reason"
              :key="reason"
              v-model="selectedReason"
              class="mb-4"
              name="reason"
              :value="reason"
            >
              <div class="flex flex-col gap-2 w-full">
                <div>
                  {{ $t(`media-details.content-report.form.${reason}.option`) }}
                </div>
                <VDmcaNotice
                  v-if="reason === reasons.DMCA"
                  v-show="reason === selectedReason"
                  :provider="providerName"
                  :media-url="media.foreign_landing_url"
                />
                <VOtherIssueForm
                  v-if="reason === reasons.OTHER"
                  v-show="reason === selectedReason"
                  key="other"
                  v-model="description"
                />
              </div>
            </VRadio>
          </template>
        </fieldset>

        <div class="flex flex-row items-center justify-end gap-4">
          <VButton variant="tertiary" @click="handleCancel">
            {{ $t('media-details.content-report.form.cancel') }}
          </VButton>

          <VButton
            v-if="selectedReason === reasons.DMCA"
            key="dmca"
            as="a"
            variant="secondary"
            :href="DMCA_FORM_URL"
            target="_blank"
            rel="noopener"
          >
            {{ $t('media-details.content-report.form.dmca.open') }}
            <VIcon :size="4" class="ms-1" :icon-path="icons.externalLink" />
          </VButton>
          <VButton
            v-else
            key="non-dmca"
            :disabled="isSubmitDisabled"
            variant="secondary"
            @click="handleSubmit"
          >
            {{ $t('media-details.content-report.form.submit') }}
          </VButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

import VButton from '~/components/VButton.vue'
import VRadio from '~/components/VRadio/VRadio.vue'
import VDmcaNotice from '~/components/VContentReport/VDmcaNotice.vue'
import VOtherIssueForm from '~/components/VContentReport/VOtherIssueForm.vue'

import ReportService from '~/data/report-service'

import { reasons, statuses, DMCA_FORM_URL } from '~/constants/content-report'

import externalLinkIcon from '~/assets/icons/external-link.svg'

export default defineComponent({
  name: 'VContentReportForm',
  components: {
    VButton,
    VRadio,
    VDmcaNotice,
    VOtherIssueForm,
  },
  props: ['media', 'providerName', 'reportService', 'closeFn'],
  setup(props) {
    const service = props.reportService || ReportService

    /** @type {import('@nuxtjs/composition-api').Ref<string|null>} */
    const status = ref(statuses.WIP)
    const selectedReason = ref(null)
    const description = ref('')

    /* Buttons */
    const handleCancel = () => {
      selectedReason.value = null
      description.value = ''
      props.closeFn()
    }

    const isSubmitDisabled = computed(
      () =>
        selectedReason.value === null ||
        (selectedReason.value === reasons.OTHER &&
          description.value.length < 20)
    )
    const handleSubmit = async () => {
      if (selectedReason.value === reasons.DMCA) return
      // Submit report
      try {
        await service.sendReport({
          identifier: props.media.identifier,
          reason: selectedReason.value,
          description: description.value,
        })
        status.value = statuses.SENT
      } catch (error) {
        status.value = statuses.FAILED
      }
    }

    return {
      icons: {
        externalLink: externalLinkIcon,
      },
      reasons,
      statuses,
      DMCA_FORM_URL,

      selectedReason,
      status,
      description,

      handleCancel,

      isSubmitDisabled,
      handleSubmit,
    }
  },
})
</script>
