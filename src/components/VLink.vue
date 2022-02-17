<template>
  <Component :is="linkComponent" v-bind="linkProperties" v-on="$listeners"
    ><slot
  /></Component>
</template>

<script>
/**
 * This is a wrapper component for all links. All VLinks have to have a valid `href` prop.
 * Links with `href` starting with `/` are treated as internal links.
 *
 * Internal links use `NuxtLink` component with `to` attribute set to `localePath(href)`
 * External links use `a` element set to open in a new tab and not raise an error with the current iframe setup.
 */
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'

const defaultProps = { target: '_blank', rel: 'noopener noreferrer' }

export default defineComponent({
  name: 'VLink',
  props: {
    href: {
      type: String,
      required: true,
      validator: (v) => !['', '#'].includes(v),
    },
  },
  setup(props) {
    const { app } = useContext()
    const isInternal = computed(() => props.href.startsWith('/'))
    const linkComponent = computed(() => (isInternal.value ? 'NuxtLink' : 'a'))

    let linkProperties = computed(() =>
      isInternal.value
        ? { to: app?.localePath(props.href) ?? props.href }
        : { ...defaultProps, href: props.href }
    )

    return { linkProperties, linkComponent }
  },
})
</script>
