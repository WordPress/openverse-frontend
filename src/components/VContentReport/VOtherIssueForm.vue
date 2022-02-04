<template>
  <label class="other-form block" for="description">
    {{ $t('media-details.content-report.form.other.note') }}
    <textarea
      id="description"
      v-model="text"
      class="h-20 w-full border border-dark-charcoal-20 placeholder-dark-charcoal-70 mt-2 p-2"
      :placeholder="$t('media-details.content-report.form.other.minimum')"
    />
  </label>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'VOtherIssueForm',
  model: {
    prop: 'content',
    event: 'input',
  },
  props: {
    /**
     * the contents of the textarea
     */
    content: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const text = computed({
      get: () => props.content,
      set: (val) => emit('input', val),
    })

    return {
      text,
    }
  },
})
</script>
