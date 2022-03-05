<template>
  <div class="reuse-survey caption mt-1">
    {{ $t('photo-details.survey.content') }}
    <VLink
      :href="formLink"
      @click="onReuseSurveyClick"
      @keyup.enter="onReuseSurveyClick"
    >
      {{ $t('photo-details.survey.link') }}
    </VLink>
    {{ $t('photo-details.survey.answer') }}
  </div>
</template>

<script>
import { DETAIL_PAGE_EVENTS } from '~/constants/usage-data-analytics-types'

import { useUsageDataStore } from '~/stores/usage-data'

import VLink from '~/components/VLink.vue'

const reuseForm =
  'https://docs.google.com/forms/d/e/1FAIpQLSegPUDIUj_odzclJhhWRfPumSfbHtXDVDCHqRfFl7ZS8cMn2g/viewform'
const imageLinkEntry = '2039681354'

export default {
  name: 'VReuseSurvey',
  components: { VLink },
  props: ['image'],
  setup(props) {
    const usageDataStore = useUsageDataStore()
    const onReuseSurveyClick = () => {
      usageDataStore.sendDetailPageEvent({
        eventType: DETAIL_PAGE_EVENTS.REUSE_SURVEY,
        resultUuid: props.image.id,
      })
    }
    return {
      onReuseSurveyClick,
    }
  },
  data: () => ({
    location: '',
  }),
  computed: {
    formLink() {
      const location = this.location
      return `${reuseForm}?entry.${imageLinkEntry}=${location}`
    },
  },
  mounted() {
    this.location = window.location.href
  },
}
</script>
