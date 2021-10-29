import VButton from '~/components/VButton'

export default {
  title: 'Components/VButton',
  component: VButton,
  argTypes: {
    variant: {
      options: [
        'primary',
        'secondary',
        'tertiary',
        'action-menu',
        'action-menu-muted',
      ],
      control: { type: 'radio' },
    },
    as: {
      options: ['button', 'a', 'div', 'input'],
      control: { type: 'radio' },
    },
    pressed: 'boolean',
    size: {
      options: ['large', 'medium', 'small'],
      control: { type: 'radio' },
    },
    disabled: 'boolean',
    focusable: 'boolean',
  },
}

const VButtonStory = (args, { argTypes }) => ({
  template: `
    <div>
      <VButton v-bind="$props" @click="onClick">Code is Poetry</VButton>

      <label class="mt-4">
        File button
        <VButton as="input" type="file" />
      </label>
    </div>
  `,
  components: { VButton },
  props: Object.keys(argTypes),
  methods: {
    onClick() {
      window.alert('hello!')
    },
  },
})

export const Default = VButtonStory.bind({})
Default.args = {}
