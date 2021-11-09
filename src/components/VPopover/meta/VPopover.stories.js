import VPopover from '~/components/VPopover/VPopover.vue'
import VButton from '~/components/VButton'

export default {
  component: VPopover,
  title: 'Components/VPopover',
}

export const Default = () => ({
  template: `
    <div>
      <div tabindex="0">Focusable external area</div>
      <VPopover label="Test label">
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
})

export const TwoPopovers = () => ({
  template: `
    <div>
      <VPopover label="First popover">
        <template #trigger="{ visible, a11yProps }">
          <VButton :pressed="visible" v-bind="a11yProps">{{ visible ? 'First popover open' : 'First popover closed' }}</VButton>
        </template>
        <template #content>
          <div>First popover content</div>
        </template>
      </VPopover>
      <div class="h-5">Some content</div>
      <VPopover label="Second popover">
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
