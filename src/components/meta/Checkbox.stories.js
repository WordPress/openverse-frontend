import Checkbox from '~/components/Checkbox'
import License from '~/components/License/License'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    value: 'boolean',
    label: {
      type: 'string',
      control: {
        type: 'text',
      },
    },
    default: {
      type: 'number',
      control: { type: 'text' },
    },
    disabled: 'boolean',
  },
}

const SimpleCheckboxStory = (args, { argTypes }) => ({
  template: `<Checkbox v-bind="$props" id="simple" @change="onChange" label="Code is Poetry" />`,
  components: { Checkbox },
  props: Object.keys(argTypes),
  methods: {
    onChange() {
      window.alert(`Checkbox checked!`)
    },
  },
})

const DisabledCheckboxStory = (args, { argTypes }) => ({
  template: `<Checkbox v-bind="$props" id="disabled" disabled="true" @change="onChange" label="Use commercially" />`,
  components: { Checkbox },
  props: Object.keys(argTypes),
})

const LicenseCheckboxStory = (args, { argTypes }) => ({
  template: `<Checkbox v-bind="$props" id="license" @change="onChange"><License license="by-nc" /></Checkbox>`,
  components: { Checkbox, License },
  props: Object.keys(argTypes),
  methods: {
    onChange() {
      window.alert('License checkbox checked!')
    },
  },
})

export const Default = SimpleCheckboxStory.bind({})
Default.args = {}

export const DisabledCheckbox = DisabledCheckboxStory.bind({})
DisabledCheckbox.args = {}

export const LicenseCheckbox = LicenseCheckboxStory.bind({})
LicenseCheckbox.args = {}
