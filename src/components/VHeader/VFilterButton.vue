<template>
  <VButton
    v-show="showButton"
    :variant="button.variant"
    class="self-center"
    :pressed="pressed"
    aria-controls="filter-sidebar"
    :aria-label="button.label"
    @click="toggleFilters"
  >
    <VIcon
      v-show="icon.show"
      :icon-path="filterIcon"
      :class="{ 'me-2': icon.needsPadding }"
    />
    <span v-if="!button.isSrOnly" class="font-bold">{{ button.label }}</span>
  </VButton>
</template>

<script>
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { isScreen } from '~/composables/use-media-query'

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
    pressed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { i18n, store } = useContext()
    const isMdScreen = isScreen('md')
    const { isHeaderScrolled, pressed } = toRefs(props)

    const appliedFilterTags = computed(
      () => store.getters['search/appliedFilterTags'].length
    )
    const isAnyFilterApplied = computed(() => appliedFilterTags.value > 0)

    const labelWithCount = (count) => {
      return i18n.tc('header.filter-button.with-count', count)
    }

    const icon = reactive({
      show: true,
      needsPadding: false,
    })

    const button = reactive({
      variant: 'action-menu',
      label: i18n.t('header.filter-button.simple'),
      isSrOnly: false,
      a11yProps: { class: 'sr-only' },
    })

    const computeButtonVariant = () => {
      let variant
      if (isAnyFilterApplied.value) {
        variant = 'action-menu-muted'
      } else if (isHeaderScrolled.value) {
        variant = 'action-menu-secondary'
      } else {
        // 'Pressed' button also uses 'action-menu' variant with pressed=true
        variant = 'action-menu'
      }
      return variant
    }
    const computeButtonLabel = () => {
      if (isAnyFilterApplied.value) {
        button.label =
          isMdScreen.value && !isHeaderScrolled.value
            ? appliedFilterTags.value.toLocaleString('en')
            : labelWithCount(appliedFilterTags.value)
        button.isSrOnly = true
        button.a11yProps = {}
        icon.show = false
        icon.needsPadding = false
      } else {
        button.label = i18n.t('header.filter-button.simple')
        button.isSrOnly = !isMdScreen.value
        if (button.isSrOnly) {
          button.a11yProps = { class: 'sr-only' }
        }
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
    watch(
      [pressed, isAnyFilterApplied, isHeaderScrolled, isMdScreen],
      () => {
        updateButton()
      },
      { immediate: true }
    )

    const toggleFilters = () => {
      emit('toggle')
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

      icon,
      button,

      toggleFilters,
    }
  },
})

export default VFilterButton
</script>
