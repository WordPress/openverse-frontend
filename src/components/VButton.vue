<template>
  <Component
    :is="as"
    :type="as === 'button' ? $props.type || 'button' : undefined"
    v-bind="filteredProps"
    :class="[
      $style.button,
      $style[variant],
      pressed && $style[`${variant}-pressed`],
      $style[`size-${size}`],
    ]"
    v-on="$listeners"
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
      validate: (v) =>
        [
          'primary',
          'secondary',
          'tertiary',
          'action-menu',
          'action-menu-muted',
        ].includes(v),
    },
    /**
     * Allows for programmatically setting the pressed state of a button,
     * i.e., in the case of a button opening a menu.
     */
    pressed: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
      validate: (v) => ['large', 'medium', 'small'].includes(v),
    },
  },
  // eslint-disable-next-line no-unused-vars
  setup({ as, variant, pressed, size, ...filteredProps }) {
    return { filteredProps }
  },
})

export default VButton
</script>

<style module>
.button {
  @apply flex max-w-max items-center rounded-sm justify-center transition-shadow duration-100 ease-linear disabled:opacity-70 focus:outline-none focus-visible:ring focus-visible:ring-offset-2 no-underline appearance-none;
}

.size-small {
  @apply py-1 px-2;
}

.size-medium {
  @apply py-2 px-4;
}

.size-large {
  @apply py-6 px-8;
}

a.button {
  @apply no-underline;
}

.primary {
  @apply bg-pink text-white focus-visible:ring-pink hover:bg-dark-pink hover:text-white;
}

.primary-pressed {
  @apply bg-dark-pink;
}

.secondary {
  @apply bg-dark-charcoal text-white font-bold focus-visible:ring-pink hover:bg-dark-charcoal-80 hover:text-white;
}

.secondary-pressed {
  @apply bg-dark-charcoal-80;
}

.tertiary {
  @apply bg-white text-black hover:bg-dark-charcoal hover:text-white border border-dark-charcoal-20 hover:border-tx focus-visible:ring-pink;
}

.tertiary-pressed {
  @apply bg-dark-charcoal text-white border-tx;
}

.action-menu {
  @apply bg-white text-black border border-tx hover:border-dark-charcoal-20 focus-visible:ring-pink;
}

.action-menu-pressed {
  @apply border-tx bg-dark-charcoal text-white;
}

.action-menu-muted {
  @apply bg-dark-charcoal-10 text-black border border-tx hover:border-dark-charcoal-20 focus-visible:ring-pink;
}

.action-menu-muted-pressed {
  @apply border-tx bg-dark-charcoal text-white;
}
</style>
