<template>
  <label :for="id" class="checkbox-label" :class="labelClasses">
    <input
      :id="id"
      type="checkbox"
      class="checkbox"
      :name="inputName"
      :value="inputValue"
      v-bind="inputAttrs"
      @change="onChange"
    />
    <Checkmark
      v-show="checked"
      class="checkmark"
      focusable="false"
      width="20"
      height="20"
      role="img"
    />
    <!--  @slot The checkbox label  --><slot />
  </label>
</template>

<script>
import Checkmark from '~/assets/icons/checkmark.svg?inline'

export default {
  name: 'Checkbox',
  components: { Checkmark },
  props: {
    /**
     * Checkbox `id` is used for the input id property, connecting the label to
     * the checkbox. id is also used in the `change` event payload as the `name`
     * and `value` parameters if they are not set.
     */
    id: {
      type: String,
      required: true,
    },
    /**
     * Whether the checkbox is checked or not. No indeterminate state is allowed.
     *
     * @default false
     */
    checked: {
      type: Boolean,
      default: false,
    },
    /**
     * The name and value parameters are used when sending the form data to the server
     * using HTML on form submit: if a checkbox is checked, `name=value` pair in
     * the POST request body.
     * In a Vue app, this is used as the name parameter in the emitted event's payload.
     * It is usually the category that this checkbox belongs to, eg. licenseType for a
     * 'cc-by' checkbox.
     * If not set, the value of `id` prop is used instead.
     */
    name: {
      type: String,
      required: false,
    },
    /**
     * The value that is sent in the `change` event's payload. The value of `id` prop
     * is used if `value` is not set.
     */
    value: {
      type: String,
      required: false,
    },
    /**
     * Sets disabled property of the input and changes label opacity if set to true.
     */
    disabled: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    inputName() {
      return this.name || this.id
    },
    inputValue() {
      return this.value || this.id
    },
    labelClasses() {
      return this.disabled ? 'opacity-50' : ''
    },
    inputAttrs() {
      const attrs = {}
      if (this.disabled) {
        attrs.disabled = 'disabled'
      }
      if (this.checked) {
        attrs.checked = 'checked'
      }
      return attrs
    },
  },
  methods: {
    onChange() {
      this.$emit('change', {
        name: this.inputName,
        value: this.inputValue,
        checked: !this.checked,
      })
    },
  },
}
</script>
<style scoped>
.checkbox-label {
  @apply relative flex text-sm text-dark-charcoal leading-5;
}
.checkbox {
  @apply appearance-none w-5 h-5 border-dark-charcoal border rounded-sm me-2 flex-shrink-0 relative;
  @apply focus:outline-none focus:ring focus:ring-offset-2 focus:ring-pink;
  @apply transition-colors disabled:opacity-50;
  @apply checked:bg-dark-charcoal;
}
.checkmark {
  @apply absolute left-0 w-5 h-5 text-white;
}
</style>
