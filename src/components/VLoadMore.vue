<template>
  <button
    v-show="!isError"
    type="button"
    class="load-more pb-6 w-full"
    :disabled="isFinished || isFetching"
    @click="onLoadMore"
  >
    <span>{{ buttonLabel }}</span>
  </button>
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
