<template>
  <div>
    <i18n
      path="photo-details.content-report.dmca-content"
      tag="p"
      class="block px-6 mt-10 text-center"
    >
      <template #link>
        <a
          :aria-label="$t('photo-details.aria.dmca')"
          :href="dmcaFormUrl"
          target="_blank"
          rel="noopener"
          >{{ $t('photo-details.content-report.link') }}</a
        >
      </template>
    </i18n>

    <i18n
      path="photo-details.content-report.provider"
      tag="p"
      class="block px-6 mt-4 text-center"
    >
      <template #link>
        <a
          :aria-label="
            $t('photo-details.aria.provider-report-form', {
              provider: providerName,
            })
          "
          :href="imageURL"
          target="_blank"
          rel="noopener"
          >{{ providerName }}</a
        >
      </template>
    </i18n>

    <VButton
      type="button"
      variant="action-button"
      size="small"
      @click="onBackClick"
    >
      <VIcon :icon-path="chevronLeftIcon" class="me-2" />
      {{ $t('photo-details.content-report.back') }}
    </VButton>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'
import chevronLeftIcon from '~/assets/icons/chevron-left.svg'

export default defineComponent({
  name: 'DmcaNotice',
  components: { VButton, VIcon },
  props: {
    dmcaFormUrl: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
  },
  setup(_, { emit }) {
    const onBackClick = () => {
      emit('onBackClick')
    }
    return { chevronLeftIcon, onBackClick }
  },
})
</script>
