<template>
  <label :for="id" class="radio-label relative flex leading-5">
    <input
      :id="id"
      v-bind="$attrs"
      :value="value"
      class="radio appearance-none relative flex-shrink-0 bg-white w-5 h-5 border border-dark-charcoal rounded-full me-3 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-pink disabled:bg-dark-charcoal-10 disabled:border-dark-charcoal-40"
      type="radio"
      :checked="isChecked"
      @input="handleInput"
    />
    <VIcon
      class="radiomark absolute start-0 text-dark-charcoal opacity-0 transition-opacity"
      :icon-path="radiomark"
      view-box="0 0 20 20"
      width="20"
      height="20"
      :size="5"
    />
    <!--  @slot Label content goes here  -->
    <slot />
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { defineEvent } from '~/types/emits'

import VIcon from '~/components/VIcon/VIcon.vue'

import radiomark from '~/assets/icons/radiomark.svg'

/**
 * Renders a radio input field, useful for choosing one of a few options that
 * can all be presented on the screen at once.
 */
export default defineComponent({
  name: 'VRadio',
  components: {
    VIcon,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    /**
     * the input `id` property; This is used to connect the label to the radio.
     */
    id: {
      type: String,
      required: true,
    },
    /**
     * the value associated with this radio input
     */
    value: {
      type: String,
      required: true,
    },
    /**
     * the value of the `v-model` associated with the radio group
     */
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: {
    change: defineEvent<[string]>(),
  },
  setup(props, { emit }) {
    const isChecked = computed(() => props.value === props.modelValue)

    const handleInput = () => {
      emit('change', props.value)
    }

    return {
      radiomark,

      isChecked,
      handleInput,
    }
  },
})
</script>

<style scoped>
.radio:checked ~ .radiomark {
  @apply opacity-100;
}

.radio:disabled ~ .radiomark {
  @apply text-dark-charcoal-70;
}
</style>
