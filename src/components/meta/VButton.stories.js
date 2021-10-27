import VButton from '~/components/VButton'

export default {
  title: 'Components/VButton',
  component: VButton,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'radio' },
    },
    as: {
      options: ['button', 'a'],
      control: { type: 'radio' },
    },
    active: 'boolean',
    size: {
      options: ['default', 'small'],
      control: { type: 'radio' },
    },
  },
}

const VButtonStory = (args, { argTypes }) => ({
  template: `<VButton v-bind="$props" @click="onClick">Code is Poetry</VButton>`,
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
