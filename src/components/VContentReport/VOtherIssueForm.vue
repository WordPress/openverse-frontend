<template>
  <div class="other-form">
    <div class="flex flex-row items-center justify-between">
      <label for="description">{{
        $t('media-details.content-report.form.other.note')
      }}</label>
      <span class="text-dark-charcoal-70">{{ text.length }}</span>
    </div>

    <!-- eslint-disable vuejs-accessibility/form-control-has-label -->
    <textarea
      id="description"
      v-model="text"
      class="h-20 w-full border border-dark-charcoal-20 placeholder-dark-charcoal-70 mt-2 p-2"
      :placeholder="$t('media-details.content-report.form.other.minimum')"
    />
    <!-- eslint-enable -->
  </div>
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
