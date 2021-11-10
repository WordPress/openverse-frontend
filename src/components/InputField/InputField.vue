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
    <label class="flex-grow" :for="fieldId">
      <span v-if="labelText" class="sr-only">{{ labelText }}</span>
      <input
        :id="fieldId"
        v-model="text"
        v-bind="$attrs"
        :type="type"
        class="leading-none font-semibold bg-tx placeholder-dark-charcoal-70 ms-4 h-full focus:outline-none"
      />
    </label>
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
     * the textual content of the label associated with this input field
     */
    labelText: {
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
    const type = attrs['type'] ?? 'text'
    const fieldId = attrs['id'] ?? btoa(Date.now().toString())

    const text = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      },
    })

    return {
      type,
      fieldId,

      text,
    }
  },
}
</script>
