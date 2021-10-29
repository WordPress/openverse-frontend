<template>
  <Component
    :is="as"
    ref="node"
    :type="typeValue"
    :role="role"
    v-bind="filteredProps"
    :class="[
      $style.button,
      $style[variant],
      pressed && $style[`${variant}-pressed`],
      $style[`size-${size}`],
    ]"
    :aria-pressed="pressed"
    :disabled="disabledValue"
    :tabindex="tabIndex"
    v-on="$listeners"
  >
    {{ type }}
    <slot />
  </Component>
</template>

<script>
import { defineComponent, ref, watch, toRefs } from '@nuxtjs/composition-api'
import { isButton } from 'reakit-utils'
import { getTabIndex } from '~/utils/a11y/get-tab-index'
import { isNativeTabbable } from '~/utils/a11y/is-native-tabbale'
import { supportsDisabledAttribute } from '~/utils/a11y/supports-disabled-attribute'

/**
 * A button component that behaves just like a regular HTML `button` element
 * aside from pre-applied styles based on the passed in variant.
 *
 * All props available for the basic `button` component are available here as
 * well, including an `as` prop which allows for component polymorphism. The
 * most common use case for this prop is to turn the `VButton` component into
 * an `anchor` element, so that you can render a link instead of a `button`.
 *
 * The accessibility helpers on this component are critical and are completely
 * adapted from Reakit's Button, Clickable, and Tabbable component implementations.
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
    disabled: {
      type: Boolean,
      default: false,
    },
    focusable: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'button',
      validate: (v) => ['button', 'submit', 'reset'].includes(v),
    },
  },
  /* eslint-disable no-unused-vars */
  setup(props) {
    const propsRef = toRefs(props)
    const disabledPropRef = propsRef.disabled
    const disabledRef = ref(disabledPropRef.value)
    const focusableRef = propsRef.focusable
    /** @type {import('@nuxtjs/composition-api').Ref<Element | undefined>} */
    const nodeRef = ref()
    const trulyDisabledRef = ref(disabledPropRef.value && !focusableRef.value)
    const typeRef = ref(propsRef.type.value)
    const roleRef = ref(undefined)
    const nativeTabbableRef = ref(true)
    const supportsDisabledRef = ref(true)
    const tabIndexRef = propsRef.tabindex || ref(undefined)

    watch([propsRef.disabled, propsRef.focusable], ([disabled, focusable]) => {
      trulyDisabledRef.value = disabled && !focusable
    })

    // We check all this stuff against the `node` directly because `as` could be a Vue component!
    // In that case we need to know what element it ultimately renders to decide what a11y props to configure
    watch(nodeRef, (element) => {
      if (element.tagName === 'BUTTON') {
        typeRef.value = propsRef.type.value
      } else {
        typeRef.value = undefined
      }

      // https://github.com/reakit/reakit/blob/41bd33be66ebcd0b4dcb63155e3ff03e1ae9dfc8/packages/reakit/src/Button/Button.ts#L34
      if (!isButton(element)) {
        if (element.tagName !== 'A') {
          roleRef.value = 'button'
        }
      }

      if (!isNativeTabbable(element)) {
        nativeTabbableRef.value = false
      }
      if (!supportsDisabledAttribute(element)) {
        supportsDisabledRef.value = false
      }
    })

    watch(
      [trulyDisabledRef, nativeTabbableRef, supportsDisabledRef],
      ([trulyDisabled, nativeTabbable, supportsDisabled]) => {
        tabIndexRef.value = getTabIndex(
          trulyDisabled,
          nativeTabbable,
          supportsDisabled,
          tabIndexRef.value
        )

        disabledRef.value = trulyDisabled && supportsDisabled ? true : undefined
      },
      { immediate: true }
    )

    // prevent `v-bind` from putting a bunch of nonsense props in the dom by filtering
    // both the ones we configure ourselves (like `disabled`) and then the non-standard
    // props like `pressed` and `focusable`
    const {
      as,
      type,
      role,
      tabindex,
      disabled,
      focusable,
      size,
      variant,
      pressed,
      ...filteredProps
    } = props

    return {
      disabledValue: disabledRef,
      node: nodeRef,
      typeValue: typeRef,
      role: roleRef,
      tabIndex: tabIndexRef,
      filteredProps,
    }
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
