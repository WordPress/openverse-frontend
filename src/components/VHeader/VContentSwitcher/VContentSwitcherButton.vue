<template>
  <VButton
    class="flex flex-row font-semibold px-3 py-2"
    :class="{ 'w-12': isHeaderScrolled && !isMinScreenMd }"
    :variant="buttonVariant"
    size="disabled"
    :aria-label="buttonLabel"
    v-bind="a11yProps"
    @click="$emit('click')"
  >
    <VIcon :icon-path="icon" />
    <NuxtLink
      v-show="showLabel"
      v-bind="nuxtLinkProps"
      :class="{ 'ms-2': showLabel }"
      >{{ buttonLabel }}</NuxtLink
    >
    <VIcon
      v-show="isMinScreenMd"
      class="text-dark-charcoal-40"
      :class="{ 'ms-2': isMinScreenMd }"
      :icon-path="caretDownIcon"
    />
  </VButton>
</template>
<script>
import {
  computed,
  inject,
  ref,
  useContext,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import caretDownIcon from '~/assets/icons/caret-down.svg'

import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon.vue'

export default {
  name: 'VContentSwitcherButton',
  components: { VButton, VIcon },
  props: {
    activeItem: {
      type: String,
      required: true,
    },
    icon: {
      type: process.env.NODE_ENV === 'test' ? Object : String,
      required: true,
    },
    a11yProps: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { app, i18n } = useContext()
    const route = useRoute()
    const isHeaderScrolled = inject('isHeaderScrolled')
    const isMinScreenMd = inject('isMinScreenMd')

    const buttonVariant = computed(() => {
      return isMinScreenMd.value && !isHeaderScrolled.value
        ? 'tertiary'
        : 'action-menu'
    })
    const buttonLabel = computed(() => {
      const labelKey = {
        image: 'search-type.image',
        audio: 'search-type.audio',
        all: 'search-type.all',
        video: 'search-type.video',
      }[props.activeItem]
      return i18n.t(labelKey)
    })
    const showLabel = computed(
      () => isMinScreenMd.value || !isHeaderScrolled.value
    )

    const localePath = (item, query) =>
      app.localePath({ path: `/search/${item === 'all' ? '' : item}/`, query })

    // TODO (obulat): How do we mock useRoute()?
    const nuxtLinkProps = ref({
      'aria-current': 'page',
      to: localePath(props.activeItem, route?.value?.query),
    })
    watch([route], ([route]) => {
      nuxtLinkProps.value = {
        'aria-current': 'page',
        to: localePath(props.activeItem, route?.query),
      }
    })

    return {
      buttonVariant,
      buttonLabel,
      caretDownIcon,
      showLabel,
      isHeaderScrolled,
      isMinScreenMd,
      nuxtLinkProps,
    }
  },
}
</script>
