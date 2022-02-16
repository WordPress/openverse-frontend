<template>
  <Component :is="linkComponent" v-bind="linkProperties" v-on="$listeners"
    ><slot
  /></Component>
</template>

<script>
/**
 * This is a wrapper component for all links. All VLinks have to have a valid `href` attr.
 * Links with `href` starting with `/` are treated as internal links.
 *
 * Internal links use `NuxtLink` component with `to` attribute set to `localePath(href)`
 * External links use `a` element set to open in a new tab and not raise an error with the current iframe setup.
 */
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { warn } from '@/utils/warn'
const defaultProps = { target: '_blank', rel: 'noopener noreferrer' }
export default defineComponent({
  name: 'VLink',
  setup(_, { attrs }) {
    const { app } = useContext()
    const isInternal = computed(() => attrs.href?.startsWith('/'))
    const linkComponent = computed(() => (isInternal.value ? 'NuxtLink' : 'a'))
    const { href, ...otherProperties } = attrs

    // No need to declare `href` as an explicit prop as Vue preserves
    // the `attrs` object reference between renders and updates the properties
    // meaning we'll always have the latest values for the properties on the
    // attrs object
    if (!href || href === '#') {
      warn('VLink is missing a valid `href` attribute.')
    }

    const linkProperties = computed(() =>
      isInternal.value
        ? { ...otherProperties, to: app.localePath(href) }
        : {
            ...otherProperties,
            ...defaultProps,
            href,
          }
    )
    return { linkProperties, linkComponent }
  },
})
</script>
