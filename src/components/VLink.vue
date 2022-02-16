<template>
  <Component :is="linkComponent" v-bind="linkProperties" v-on="$listeners"
    ><slot
  /></Component>
</template>

<script>
/**
 * This is a simple wrapper component for external links that ensures that the links
 * are set to open in a new tab and not raise an error with the current iframe setup.
 */
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
const defaultProps = { target: '_blank', rel: 'noopener noreferrer' }
export default defineComponent({
  name: 'VLink',
  setup(_, { attrs }) {
    const { app } = useContext()
    const isInternal = computed(() => attrs.href.startsWith('/'))
    const linkComponent = computed(() => (isInternal.value ? 'NuxtLink' : 'a'))
    const { href, ...otherProperties } = attrs
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
