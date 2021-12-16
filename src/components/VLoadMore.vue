<template>
  <VButton
    v-show="!isError"
    size="large"
    variant="plain"
    type="button"
    class="w-full font-semibold bg-dark-charcoal-06"
    :disabled="isFinished || isFetching"
    @click="onLoadMore"
  >
    <span>{{ buttonLabel }}</span>
  </VButton>
</template>
<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'VLoadMore',
  props: {
    isFetching: {
      type: Boolean,
      default: true,
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    mediaType: {
      type: String,
      default: 'image',
    },
  },
  setup(props, { emit }) {
    const { i18n } = useContext()

    const finishedLabel = computed(() => {
      const type = i18n.t(`browse-page.search-form.${props.mediaType}`)
      return i18n.t('browse-page.no-more', { type })
    })

    const buttonLabel = computed(() => {
      return props.isFinished ? finishedLabel.value : i18n.t('browse-page.load')
    })

    const onLoadMore = () => {
      emit('onLoadMore')
    }

    return {
      finishedLabel,
      buttonLabel,
      onLoadMore,
    }
  },
})
</script>
