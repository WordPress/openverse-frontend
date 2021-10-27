<template>
  <Component
    :is="as"
    :type="as === 'button' ? $props.type || 'button' : undefined"
    v-bind="filteredProps"
    :class="[
      $style.button,
      $style[variant],
      active && $style[`${variant}-active`],
      $style[`size-${size}`],
    ]"
  >
    <slot />
  </Component>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

/**
 * A button component that behaves just like a regular HTML `button` element
 * aside from pre-applied styles based on the passed in variant.
 *
 * All props available for the basic `button` component are available here as
 * well, including an `as` prop which allows for component polymorphism. The
 * most common use case for this prop is to turn the `VButton` component into
 * an `anchor` element, so that you can render a link instead of a `button`.
 *
 * This also implements basic accessibility checks.
 */
const VButton = defineComponent({
  name: 'VButton',
  props: {
    as: {
      type: [String, Object],
      default: 'button',
    },
    variant: {
      type: String,
      default: 'primary',
      validate: (v) => ['primary', 'secondary', 'tertiary'].includes(v),
    },
    /**
     * Allows for programatically setting the active state of a button,
     * i.e., in the case of a button opening a menu.
     */
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
      validate: (v) => ['default', 'small'].includes(v),
    },
  },
  // eslint-disable-next-line no-unused-vars
  setup({ as, variant, active, size, ...filteredProps }) {
    return { filteredProps }
  },
})

export default VButton
</script>

<style module>
.button {
  @apply flex max-w-max items-center rounded-sm justify-center transition-shadow duration-100 ease-linear disabled:opacity-70 focus:outline-none focus-visible:ring focus-visible:ring-offset-2 no-underline appearance-none;
}

.size-default {
  @apply py-2 px-4;
}

.size-small {
  @apply py-1 px-2;
}

a.button {
  @apply no-underline;
}

.primary {
  @apply bg-pink text-white focus-visible:ring-pink hover:bg-dark-pink hover:text-white;
}

.primary-active {
  @apply bg-dark-pink;
}

.secondary {
  @apply bg-dark-charcoal text-white font-bold focus-visible:ring-pink hover:bg-dark-charcoal-80 hover:text-white;
}

.secondary-active {
  @apply bg-dark-charcoal-80;
}

.tertiary {
  @apply bg-white text-black hover:bg-dark-charcoal hover:text-white border border-dark-charcoal-20 hover:border-tx focus-visible:ring-pink;
}
</style>
