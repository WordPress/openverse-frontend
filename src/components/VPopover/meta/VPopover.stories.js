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
