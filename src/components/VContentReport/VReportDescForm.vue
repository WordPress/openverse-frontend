<template>
  <label class="other-form block" for="description">
    <span class="flex flex-row justify-between items-center">
      <span>{{ $t('media-details.content-report.form.other.note') }}</span>
      <span>{{
        $t(
          isRequired
            ? 'media-details.content-report.form.required'
            : 'media-details.content-report.form.optional'
        )
      }}</span>
    </span>
    <textarea
      id="description"
      v-model="text"
      class="h-20 w-full border border-dark-charcoal-20 placeholder-dark-charcoal-70 mt-2 p-2"
      :placeholder="$t('media-details.content-report.form.other.minimum')"
      :required="isRequired"
    />
  </label>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'VReportDescForm',
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
    /**
     * whether populating the field is mandatory
     */
    isRequired: {
      type: Boolean,
      default: false,
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
