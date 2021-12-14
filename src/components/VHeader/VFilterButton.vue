<template>
  <VButton
    v-show="showButton"
    :variant="button.variant"
    class="self-center"
    :pressed="pressed"
    aria-controls="filter-sidebar"
    @click="toggleFilters"
  >
    <VIcon
      v-show="icon.show"
      :icon-path="filterIcon"
      :class="{ 'me-2': icon.needsPadding }"
    />
    <span class="filter-label" :class="button.a11yProps">{{
      button.label
    }}</span>
  </VButton>
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  useContext,
  watchEffect,
} from '@nuxtjs/composition-api'
import { isScreen } from '~/composables/use-media-query'
import { useFilterSidebarVisibility } from '~/composables/use-filter-sidebar-visibility'

import filterIcon from '~/assets/icons/filter.svg'
import VButton from '~/components/VButton.vue'
import VIcon from '~/components/VIcon/VIcon'

const VFilterButton = defineComponent({
  name: 'VFilterButton',
  components: {
    VIcon,
    VButton,
  },
  props: {
    /**
     * Whether the page has been scrolled. If true:
     * - button has no border.
     * - on mobile, the button label is blank.

     * @default false
     */
    isHeaderScrolled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { i18n, store } = useContext()
    const isMdScreen = isScreen('md')

    const {
      isFilterSidebarVisible: pressed,
      setFilterSidebarVisibility,
    } = useFilterSidebarVisibility({ mediaQuery: isMdScreen })

    const appliedFilterTags = computed(
      () => store.getters['search/appliedFilterTags'].length
    )
    const isAnyFilterApplied = computed(() => appliedFilterTags.value > 0)

    const labelWithCount = (count) => {
      return i18n.tc('header.filter-button.with-count', count)
    }
    // TODO(obulat): Remove buttonVariants. The aim of this object was to lower
    // the cognitive load of remembering the variant names when debugging the
    // button.
    const buttonVariants = {
      pressed: 'action-menu-pressed',
      gray: 'action-menu-muted',
      bordered: 'action-menu',
      textOnly: 'action-menu-secondary',
    }

    const icon = reactive({
      show: true,
      needsPadding: false,
    })

    const button = reactive({
      variant: 'action-menu',
      label: i18n.t('header.filter-button.simple'),
      a11yProps: 'sr-only',
    })

    const computeButtonVariant = () => {
      let variant
      if (pressed.value) {
        variant = 'pressed'
      } else {
        if (isAnyFilterApplied.value) {
          variant = 'gray'
        } else {
          variant = props.isHeaderScrolled ? 'textOnly' : 'bordered'
        }
      }
      return buttonVariants[variant]
    }
    const computeButtonLabel = () => {
      if (isAnyFilterApplied.value) {
        button.label =
          !isMdScreen.value && props.isHeaderScrolled
            ? appliedFilterTags.value.toLocaleString('en')
            : labelWithCount(appliedFilterTags.value)
        button.a11yProps = ''
        icon.show = false
        icon.needsPadding = false
      } else {
        button.label = i18n.t('header.filter-button.simple')
        button.a11yProps = isMdScreen.value ? '' : 'sr-only'
        icon.show = true
        icon.needsPadding = !!isMdScreen.value
      }
    }
    const updateButton = () => {
      button.variant = computeButtonVariant()
      computeButtonLabel()
    }

    /**
     * Since the page is rendered as mobile first, i.e. with a visually-hidden
     * text label initially, running updateButton adds a visual label if the
     * screen size is larger than mobile when it is mounted.
     */
    watchEffect(
      () => {
        updateButton()
      },
      { immediate: true }
    )

    const toggleFilters = () => {
      setFilterSidebarVisibility(!pressed.value)
    }
    /**
     * The button is not shown on mobile when the menu overlay with filters,
     * or internal pages and content switcher, is open.
     * @type {ComputedRef<boolean>}
     */
    const showButton = computed(() => {
      return isMdScreen.value || !pressed.value
    })

    return {
      filterIcon,

      showButton,

      pressed,
      icon,
      button,

      toggleFilters,
    }
  },
})

export default VFilterButton
</script>
