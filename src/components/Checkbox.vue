<template>
  <label :for="id" class="checkbox-label" :class="labelClasses">
    <input
      :id="id"
      type="checkbox"
      class="checkbox"
      :checked="checked"
      :name="inputName"
      :value="inputValue"
      :disabled="disabled"
      @change="onChange"
    /><span>
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
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
     * The checkbox can be labeled either using the `label` prop, or the default
     * slot (for labels that can contain more than simple strings).
     *
     * @default ''
     */
    label: {
      type: String,
      default: '',
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
<style>
.checkbox-label {
  @apply flex text-sm text-dark-charcoal leading-5;
}
.checkbox {
  @apply appearance-none w-5 h-5 border-dark-charcoal border rounded-sm me-2 flex-shrink-0 relative;
  @apply focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-pink;
  @apply transition-colors disabled:opacity-50;
  @apply checked:bg-dark-charcoal;
}

.checkbox:checked::after {
  content: '';
  @apply w-2 h-4 border border-white absolute top-0 left-1/3;
  border-top: 0;
  border-left: 0;
  transform: rotate(35deg);
}
</style>
