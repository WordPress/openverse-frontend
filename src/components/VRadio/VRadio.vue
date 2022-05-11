<template>
  <label :for="id" class="radio-label relative flex leading-5">
    <input
      :id="id"
      v-bind="$attrs"
      :value="value"
      class="radio relative h-5 w-5 flex-shrink-0 appearance-none rounded-full border border-dark-charcoal bg-white me-3 focus:outline-none focus:ring focus:ring-pink focus:ring-offset-2 disabled:border-dark-charcoal-40 disabled:bg-dark-charcoal-10"
      type="radio"
      :checked="isChecked"
      @input="handleInput"
    />
    <VIcon
      class="radiomark absolute text-dark-charcoal opacity-0 transition-opacity start-0"
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
