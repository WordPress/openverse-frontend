<template>
  <VButton
    size="large"
    variant="full"
    type="button"
    :disabled="isFetching"
    @click="onLoadMore"
  >
    {{ buttonLabel }}
  </VButton>
</template>
<script>
import { computed, defineComponent } from '#app'
import { useI18n } from '~/composables/use-i18n'

export default defineComponent({
  name: 'VLoadMore',
  props: {
    isFetching: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const i18n = useI18n()

    const buttonLabel = computed(() => {
      return i18n.t('browse-page.load')
    })

    const onLoadMore = () => {
      emit('onLoadMore')
    }

    return {
      buttonLabel,
      onLoadMore,
    }
  },
})
</script>
