import VPopover from '~/components/VPopover/VPopover.vue'
import VButton from '~/components/VButton'
import { placements as popoverPlacements } from '@popperjs/core'

export default {
  component: VPopover,
  title: 'Components/VPopover',
  argTypes: {
    hideOnEsc: 'boolean',
    hideOnClickOutside: 'boolean',
    autoFocusOnShow: 'boolean',
    autoFocusOnHide: 'boolean',
    placement: {
      type: 'radio',
      options: [...popoverPlacements],
    },
    label: 'text',
    labelledBy: 'text',
  },
}

const SinglePopoverStory = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <div>
      <p>
        This story is configured to log when the popover opens or closes. Inspect the console output to observe this behavior.
      </p>
      <div tabindex="0">Focusable external area</div>
      <VPopover v-bind="$props" @open="onOpen" @close="onClose">
        <template #trigger="{ visible, a11yProps }">
          <VButton :pressed="visible" v-bind="a11yProps">{{ visible ? 'Close' : 'Open' }}</VButton>
        </template>
        <template #content>
          <div>Code is Poetry</div>
        </template>
      </VPopover>
    </div>
  `,
  components: { VPopover, VButton },
  setup() {
    const onOpen = () => console.log('opened!')
    const onClose = () => console.log('closed!')

    return { onOpen, onClose }
  },
})

export const Default = SinglePopoverStory.bind({})
Default.args = {}

const TwoPopoverStory = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <div>
      <VPopover label="First popover" v-bind="$props">
        <template #trigger="{ visible, a11yProps }">
          <VButton :pressed="visible" v-bind="a11yProps">{{ visible ? 'First popover open' : 'First popover closed' }}</VButton>
        </template>
        <template #content>
          <div>First popover content</div>
        </template>
      </VPopover>
      <div class="h-5">Some content</div>
      <VPopover label="Second popover" v-bind="$props">
        <template #trigger="{ visible, a11yProps }">
          <VButton :pressed="visible" v-bind="a11yProps">{{ visible ? 'Second popover open' : 'Second popover closed' }}</VButton>
        </template>
        <template #content>
          <div>Second popover content</div>
        </template>
      </VPopover>
    </div>
  `,
  components: { VPopover, VButton },
})

export const TwoPopovers = TwoPopoverStory.bind({})
TwoPopovers.args = {}
