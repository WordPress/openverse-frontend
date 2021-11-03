<template>
  <div
    class="input-field group flex flex-row items-center gap-4 hover:bg-dark-charcoal-06 h-12 p-0.5px focus-within:p-0 border focus-within:border-1.5 border-dark-charcoal-20 rounded-sm overflow-hidden focus-within:border-pink"
    :class="[
      {
        // Padding is set to 1.5px to accommodate the border that will appear later.
        'border-s-0 ps-1.5px rounded-s-none': connectionSides.includes('start'),
        'border-e-0 pe-1.5px rounded-e-none': connectionSides.includes('end'),
      },
    ]"
  >
    <!-- eslint-disable vuejs-accessibility/form-control-has-label -->
    <!-- The `inputId` prop is provided so that the user of the component can associate a label. -->
    <input
      v-bind="$attrs"
      :id="inputId"
      v-model="text"
      :type="type"
      class="flex-grow leading-none font-semibold bg-tx ms-4 h-full focus:outline-none"
    />
    <!-- eslint-enable vuejs-accessibility/form-control-has-label -->
    <div
      class="info font-semibold text-xs text-dark-charcoal-70 group-hover:text-dark-charcoal me-4"
    >
      <!-- @slot Extra information goes here -->
      <slot />
    </div>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'

/**
 * Provides a control to enter text as input.
 */
export default {
  name: 'InputField',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    /**
     * the textual content of the input field
     */
    value: {
      type: String,
      default: '',
    },
    /**
     * the ID to associate with the internal `<input>` element; This should be
     * used to associate a label and is recommended for a11y.
     */
    inputId: {
      type: String,
    },
    /**
     * list of sides where the field is connected to other controls
     */
    connectionSides: {
      type: Array,
      default: () => [],
      validator: (val) => val.every((item) => ['start', 'end'].includes(item)),
    },
  },
  setup(props, { emit, attrs }) {
    const text = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      },
    })

    const type = attrs['type'] ?? 'text'

    return {
      type,
      text,
    }
  },
}
</script>
