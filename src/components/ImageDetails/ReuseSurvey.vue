<template>
  <div class="reuse-survey caption mt-1">
    {{ $t('photo-details.survey.content') }}
    <VLink :href="formLink">
      {{ $t('photo-details.survey.link') }}
    </VLink>
    {{ $t('photo-details.survey.answer') }}
  </div>
</template>

<script>
import VLink from '~/components/VLink.vue'

const reuseForm =
  'https://docs.google.com/forms/d/e/1FAIpQLSegPUDIUj_odzclJhhWRfPumSfbHtXDVDCHqRfFl7ZS8cMn2g/viewform'
const imageLinkEntry = '2039681354'

export default {
  name: 'ReuseSurvey',
  components: { VLink },
  props: ['image'],
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
